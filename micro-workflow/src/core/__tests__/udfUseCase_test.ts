import { AccumulateContextType, RunWorkflow, RunWorkflowInTestMode } from '../workflowRuntime';
import { ExecDbStep } from '../execDbStep'
import { BaseBoolean, BaseString, BindingPath, CustomHashTypeDefinition, TypeDefinitionKind } from '../types';
import { applyDefinitionDefaults, FuncDefinitionHash, PastDateType, PositiveMoney, ShortAnswer } from '../workflowStep';
import { GOOD } from '../../../../udf-collector-ui/src/commons/rop/rop'
import { DateMustBeLessStep } from '../dateMustBeLessStep'
import { contextType } from './helpers/testHelpers'

describe('Workflow for udf', () => {
      // this might be created at runtime from the list of udfs given by
      //   user:
      const myFormFields: CustomHashTypeDefinition = {
        kind: TypeDefinitionKind.CustomHashTypeDefinition,
        name: 'myFormFields',
        properties:  {
            'Name1' : ShortAnswer,
            'DateModified' : PastDateType,
            'ToPay' : PositiveMoney,
        }
      }
      const myFormLabels: CustomHashTypeDefinition = {
        kind: TypeDefinitionKind.CustomHashTypeDefinition,
        name: 'myFormLabels',
        properties:  {
            'Name1' : BaseString,
            'DateModified' : BaseString,
            'ToPay' : BaseString,
        }
      }
      const myForm: CustomHashTypeDefinition = {
        kind: TypeDefinitionKind.CustomHashTypeDefinition,
        name: 'FormWithUdfs',
        properties:  {
            'FieldValues' : myFormFields,
            'FieldNames' : myFormLabels
        }
      }
      const MsgType: CustomHashTypeDefinition = {
        kind: TypeDefinitionKind.CustomHashTypeDefinition,
        name: 'MsgType',
        properties:  {
            'NewValue' : BaseString,
            'FieldName' : BaseString
        }
      }
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
           'date1': pathToDate1,
           'date2': pathToDate2
          },
          outputBinding: []
        }
      )
  })