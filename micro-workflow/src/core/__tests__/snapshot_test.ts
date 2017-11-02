import {
    calcSquaredDistance,
    concatResultsToRelative,
    flattenDistanceCombinations,
    mapDistanceCombinations,
    mapWithDistance,
} from '../DistanceHelper';

describe('DistanceHelper', () => {
    it('calculates squared distance', () => {
      const sqDis = calcSquaredDistance(1,1,4,4)
      expect(sqDis).toEqual(18)
    })
    it('generates distances list', () => {
      const relPos = [ 1, 1]
      const posList = [ 2,2, 3,3]
      const newLst = mapWithDistance(relPos, posList)
      expect(newLst).toEqual(
        [ 
          [1,1, 2,2, 2],
          [1,1, 3,3, 8]
        ]
      )
    })
    it('flattens distances list', () => {
      const posArrayOfArrays = [[1, 1, 2, 2, 2], [1, 1, 3, 3, 8]]
      const newLst = concatResultsToRelative(posArrayOfArrays)
      expect(newLst).toEqual(
          [1,1, 2,2, 2, 3,3, 8]
      )
    })
    
    it('generates distances list of lists for all positions', () => {
      const posList = [ 1,1, 2,2, 3,3]
      const newLst = mapDistanceCombinations(posList)
      expect(newLst).toEqual(
        [[[1, 1, 2, 2, 2], [1, 1, 3, 3, 8]], [[2, 2, 1, 1, 2], [2, 2, 3, 3, 2]], [[3, 3, 2, 2, 2],[3, 3, 1, 1, 8]]]
      )
    })

    it('generates flatten list of distances for all positions', () => {
      const posList = [ 1,1, 2,2, 3,3]
      const newLst = flattenDistanceCombinations(posList)
      expect(newLst).toEqual(
        [[1, 1, 2, 2, 2, 3, 3, 8], [2, 2, 1, 1, 2, 3, 3, 2], [3, 3, 2, 2, 2, 1, 1, 8]]
      )
    })
  });