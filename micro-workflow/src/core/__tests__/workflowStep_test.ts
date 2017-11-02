import { CustomHashTypeDefinition, GetDateValue } from '../types';
import {DateMustBeLess, DateWorkflowStep} from '../workflowStep';
import { GOOD } from '../../../../udf-collector-ui/src/commons/rop/rop';

describe('WorkflowStep', () => {
    it('maps input to method param', () => {
      //arrange
      const step = new DateWorkflowStep()

      // custom type definition (not the runtime data)
      const PastDateType = { name: 'PastDate', basePrimitiveType: 'Date'}
      const contextType:CustomHashTypeDefinition = {
        name: 'BlogEntry',
        properties:  { 
             'DateCreated' : PastDateType,
             'DateModified' : PastDateType 
          }
      }
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
      const date1 = GetDateValue(pathToDate1, contextData)
      const date2 = GetDateValue(pathToDate2, contextData)

      //act
      const ropResult = DateMustBeLess(date1, date2)


      //assert
      expect(ropResult).toEqual({ kind: GOOD, payload:  date1 }) 
    })
  });