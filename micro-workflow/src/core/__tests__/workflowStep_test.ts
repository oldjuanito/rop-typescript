import { validateBindingPath, validateBindingPathWithType } from '../bindingPathHelpers';
import {
    BindingPath,
    CustomHashTypeDefinition,
    getDateValue,
    TypeDefinitionKind
} from '../types';
import { DateMustBeLess, PastDateType,  WorkflowFuncDefinition } from '../workflowStep';
import { GOOD } from '../../../../udf-collector-ui/src/commons/rop/rop';


const blogEntryType:CustomHashTypeDefinition = {
  kind: TypeDefinitionKind.CustomHashTypeDefinition,
  name: 'BlogEntry',
  properties:  { 
        'DateCreated' : PastDateType,
        'DateModified' : PastDateType 
    }
}
const contextType:CustomHashTypeDefinition = {
  //notice the root alwasy wrap custom ones
    kind: TypeDefinitionKind.CustomHashTypeDefinition,
    name: 'root',
    properties:  {
        'blogEntry' : blogEntryType
      }
    }

describe('WorkflowStep', () => {
    it('maps input to method param', () => {
      //arrange

      // the data that would appear at runtime
      const contextData = {
        'BlogEntry' : {
          'DateCreated' : new Date(),
          'DateModified' : new Date()
        } 
      }
      //use the type descriptor to capture the values from the data?
      //mapping of custom type from workflow context to func params
      const pathToDate1:BindingPath = ['BlogEntry' , 'DateCreated']
      const pathToDate2:BindingPath = ['BlogEntry' , 'DateModified']

      const date1 = getDateValue(pathToDate1, contextData)
      const date2 = getDateValue(pathToDate2, contextData)

      //act
      const ropResult = DateMustBeLess(date1, date2)


      //assert
      expect(ropResult).toEqual({ kind: GOOD, payload:  date1 }) 
    })
    
    it('validates binding path', () => {
      //arrange
      // the data that would appear at runtime
     
      
      //use the type descriptor to capture the values from the data?
      //mapping of custom type from workflow context to func params
      // notice blogEntry is the name of the property in root, NOT the the TYPE name
      const pathToDate1:BindingPath = ['blogEntry' , 'DateCreated']


      //act
      const isValidPath = validateBindingPath(contextType, pathToDate1 )
      const isValid = validateBindingPathWithType(contextType, pathToDate1, {
         kind: TypeDefinitionKind.CustomPrimitiveTypeDefinitionName,
         customTypeName: 'PastDate'
      } )


      //assert
      expect(isValidPath).toEqual(true)  
      expect(isValid).toEqual(true)   
    })
    
    it('applies context assinged values to step inputs', () => {
      //arrange

      
      // the data that would appear at runtime
      const contextData = { 
        'blogEntry' : {
          'DateCreated' : new Date(),
          'DateModified' : new Date()
        } 
      }
      //use the type descriptor to capture the values from the data?
      //mapping of custom type from workflow context to func params
      // notice blogEntry is the name of the property in root, NOT the the TYPE name
      const pathToDate1:BindingPath = ['blogEntry' , 'DateCreated']
      const pathToDate2:BindingPath = ['blogEntry' , 'DateModified']

      
      const stepInstance:WorkflowStepInstanceDefinition = {
         functionDefId: 'DateMustBeLessStep',
         inputConstants: {},
         inputBindings: {
          'date1': pathToDate1,
          'date2': pathToDate2
         },
         replaceContext: true,
         doWhenOutputPathExists: 'replace' 
      }
      //act
      const ropResult = stepInstanceApply(stepInstance, funcDefintion, contextData)


      //assert
      expect(ropResult).toEqual({ kind: GOOD, payload:  date1 }) 
    })
  });