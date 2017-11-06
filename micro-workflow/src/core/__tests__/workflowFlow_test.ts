import { ExecDbStep } from '../execDbStep';
import { validateBindingPath, validateBindingPathWithType } from '../bindingPathHelpers';
import {
    BindingPath,
    CustomHashTypeDefinition,
    getDateValue,
    TypeDefinitionKind
} from '../types';
import {
    applyDefinitionDefaults,
    PastDateType
} from '../workflowStep';
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
          'DateModified' : myDate
        } 
      }
      // use the type descriptor to capture the values from the data?
      // mapping of custom type from workflow context to func params
      // notice blogEntry is the name of the property in root, NOT the the TYPE name
      const pathToDate1: BindingPath = ['blogEntry' , 'DateCreated']
      const pathToDate2: BindingPath = ['blogEntry' , 'DateModified']

      const stepInstance = applyDefinitionDefaults(
        {
          functionDefId: 'DateMustBeLessStep',
          inputBindings: {
           'date1': pathToDate1,
           'date2': pathToDate2
          }
        }
      )
      const stepInstance2 = applyDefinitionDefaults(
        {
          functionDefId: 'ExecDbStep',
          inputBindings: {
          },
          inputConstants: {
            'spName': 'spSaveBlogEntry'
          }
        }
      )
      const globalFuncDefs = {'DateMustBeLessStep': DateMustBeLessStep, 'ExecDbStep': ExecDbStep}

      // act 
      const ropResult1 = globalFuncDefs[stepInstance.functionDefId].stepInstanceApply(stepInstance, contextData)
      console.log('Step1 done: ' + JSON.stringify(contextData))
      const ropResult2 = globalFuncDefs[stepInstance2.functionDefId].stepInstanceApply(stepInstance2, contextData)
      console.log('Step2 done: ' + JSON.stringify(contextData))
      
      // TODO: make a distinction between async (use async keyword) and non-async (return inmedialety)

      // assert
      expect(ropResult2).toEqual({ kind: GOOD, payload:  true }) 
    })
  });