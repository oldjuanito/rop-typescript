import { CustomHashTypeDefinition } from '../types';
import { DateWorkflowStep } from '../workflowStep';

describe('WorkflowStep', () => {
    it('maps input to method param', () => {
      //arrange
      const step = new DateWorkflowStep()

      const context:CustomHashTypeDefinition = {
        name: 'BlogEntry',
        properties:  { 
             'DateCreated' : { name: 'PastDate', basePrimitiveType: 'Date'},
             'DateModified' : { name: 'PastDate', basePrimitiveType: 'Date'} 
          }
        
      }
      //act


      //assert
      expect(sqDis).toEqual(18)
    })
  });