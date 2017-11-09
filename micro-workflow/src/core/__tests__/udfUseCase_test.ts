import { AccumulateContextType, RunWorkflow, RunWorkflowInTestMode } from '../workflowRuntime';
import { ExecDbStep } from '../execDbStep'
import { BaseBoolean, BaseString, BindingPath, CustomHashTypeDefinition, TypeDefinitionKind } from '../types';
import { applyDefinitionDefaults, FuncDefinitionHash, PastDateType, PositiveMoney, ShortAnswer } from '../workflowStep';
import { GOOD } from '../../../../udf-collector-ui/src/commons/rop/rop'
import { DateMustBeLessStep } from '../dateMustBeLessStep'
import {  globalFuncDefs, MsgType, myForm } from './helpers/testHelpers'

describe('Workflow for udf', () => {
      
      const contextType: CustomHashTypeDefinition = {
        // notice the root always wrap custom ones
        kind: TypeDefinitionKind.CustomHashTypeDefinition,
        name: 'root',
        properties:  {
            'udfForm' : myForm,
            'currMsg' : MsgType
        }
      }
      
      // the data that would appear at runtime
      const myDate = new Date()
      const contextData = { 
        'udfForm' : {
          'FieldValues' : {
            'Name1' : 'Initial value',
            'DateModified' : myDate,
            'ToPay' : 999,
          },
          'FieldNames' : {
            'Name1' : 'Name 1',
            'DateModified' : 'Date Modified',
            'ToPay' : 'To Pay',
          },
        },
        'currMsg' : {
          'NewValue' : '',
          'FieldName' : ''
        }
      }
      const pathToFormVals: BindingPath = ['udfForm' , 'FieldValues']
      const pathToFormNames: BindingPath = ['udfForm' , 'FieldNames']
      const pathToCurrMsg: BindingPath = ['currMsg']
      
      const stepInstance = applyDefinitionDefaults(
        {
          functionDefId: 'UpdateFormFromTextMsg',
          inputBindings: {
            // msg field name and value
            // graph root to update
           'msg': pathToCurrMsg,
           'currValues': pathToFormVals
          },
          outputBinding: []
        }
      )
      const instances = [stepInstance]
      it('updates model based on new value', () => {
        // arrange

        // act
        const lastResult = RunWorkflow(globalFuncDefs, instances, contextType, contextData )
        // assert
        expect(lastResult).toEqual({ kind: GOOD, payload:  true }) 
      })
  })