import { RunWorkflow, RunWorkflowInTestMode } from '../workflowRuntime';
import { ExecDbStep } from '../execDbStep';
import { setValueInBindingPath, validateBindingPath, validateBindingPathWithType } from '../bindingPathHelpers';
import { BaseBoolean, BindingPath, CustomHashTypeDefinition, getDateValue, TypeDefinitionKind } from '../types';
import {ResultForWorkflow, applyDefinitionDefaults,  FuncDefinitionHash,  PastDateType} from '../workflowStep'
import { GOOD, PropertyError } from '../../../../udf-collector-ui/src/commons/rop/rop'
import {DateMustBeLess, DateMustBeLessStep} from "../dateMustBeLessStep";
import {contextType} from './helpers/testHelpers'


describe('Workflow Flow', () => {
      
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
      const instances = [stepInstance, stepInstance2]

      it('runs the steps', () => {
        // arrange

        // act 
        const lastResult = RunWorkflow(globalFuncDefs, instances, contextType, contextData )
        // assert
        expect(lastResult).toEqual({ kind: GOOD, payload:  true }) 
      })
      it('runs the steps in Test mode', () => {
        // arrange

        // act 
        const lastResult = RunWorkflowInTestMode(globalFuncDefs, instances, contextType, contextData )
        // assert
        expect(lastResult).toEqual({ kind: GOOD, payload:  false }) 
      })
  })