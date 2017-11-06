import { ExecDbStep } from '../execDbStep';
import { setValueInBindingPath, validateBindingPath, validateBindingPathWithType } from '../bindingPathHelpers';
import { BaseBoolean, BindingPath, CustomHashTypeDefinition, getDateValue, TypeDefinitionKind } from '../types';
import { applyDefinitionDefaults, FuncDefinitionHash, PastDateType } from '../workflowStep'
import { GOOD } from '../../../../udf-collector-ui/src/commons/rop/rop';
import {DateMustBeLess, DateMustBeLessStep} from "../dateMustBeLessStep";
import {contextType} from './helpers/testHelpers'


describe('Workflow Flow', () => {
      
    it('uns the steps', () => {
      // arrange

      
      // the data that would appear at runtime
      const myDate = new Date()
      const contextData = { 
        'blogEntry' : {
          'DateCreated' : myDate,
          'DateModified' : myDate,
          'WasSaved': false
        } 
      }
      // use the type descriptor to capture the values from the data?
      // mapping of custom type from workflow context to func params
      // notice blogEntry is the name of the property in root, NOT the the TYPE name
      const pathToDate1: BindingPath = ['blogEntry' , 'DateCreated']
      const pathToDate2: BindingPath = ['blogEntry' , 'DateModified']
      const pathToSaved: BindingPath = ['blogEntry' , 'WasSaved']

      const stepInstance = applyDefinitionDefaults(
        {
          functionDefId: 'DateMustBeLessStep',
          inputBindings: {
           'date1': pathToDate1,
           'date2': pathToDate2
          },
          outputBinding: []
        }
      )
      const stepInstance2 = applyDefinitionDefaults(
        {
          functionDefId: 'ExecDbStep',
          inputBindings: {
          },
          outputBinding:  pathToSaved,
          inputConstants: {
            'spName': 'spSaveBlogEntry'
          } 
        }
      )
      const globalFuncDefs: FuncDefinitionHash = {'DateMustBeLessStep': DateMustBeLessStep, 'ExecDbStep': ExecDbStep}

      // act 
      const ropResult1 = globalFuncDefs[stepInstance.functionDefId].stepInstanceApply(stepInstance, contextData)
      switch (ropResult1.kind) {
        case GOOD:
            setValueInBindingPath(contextType, stepInstance.outputBinding, contextData, 
                                  ropResult1.payload, stepInstance.doWhenOutputPathExists === 'append')
            console.log('Step1 done: ' + JSON.stringify(contextData))
            const ropResult2 = globalFuncDefs[stepInstance2.functionDefId].stepInstanceApply(stepInstance2, contextData)
            switch (ropResult2.kind) {
              case GOOD:
                setValueInBindingPath(contextType, stepInstance2.outputBinding, contextData, 
                                      ropResult2.payload, stepInstance2.doWhenOutputPathExists === 'append')
                console.log('Step2 done: ' + JSON.stringify(contextData))
              default:
                  return
            }
        default:
            return
      }
      
      // TODO: make a distinction between async (use async keyword) and non-async (return inmedialety)

      // assert
      expect(ropResult2).toEqual({ kind: GOOD, payload:  true }) 
    })
  })