 
export function calcSquaredDistance(x1: number, y1: number,
    x2: number, y2: number) {
        return (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1) ;
    } 
     
export function mapWithDistance([x1, y1]: number[], otherPositions: number[]) {
    const newList = []
    for (var xIdx = 0; xIdx < otherPositions.length; xIdx += 2) {
        const x2 = otherPositions[xIdx];
        const y2 = otherPositions[xIdx + 1];
        newList.push([x1, y1, x2, y2, calcSquaredDistance(x1, y1, x2, y2) ])
    };
    return newList.sort((a,b) => a[4] > b[4] ? 1 : 0)
    }
    
export function concatResultsToRelative(positions: number[][]) {
    if (positions.length < 1)
    {
        return []
    }
    const relArray= positions[0].slice(0,2)
    const otherPos = 
        positions
        .map((a) => a.slice(2,5))
        .reduce((p, c) => p.concat(c))
        .concat([ ] )
    return relArray.concat(otherPos);
}

export function mapDistanceCombinations(positions: number[]) {
    const newList = []
    for (var xIdx = 0; xIdx < positions.length; xIdx += 2) {
        const relX = positions[xIdx];
        const relY = positions[xIdx + 1];
        const otherPositions = positions.slice(0,xIdx).concat(positions.slice(xIdx + 2,positions.length))
        const distances = 
            mapWithDistance([relX, relY], otherPositions)
            
        newList.push(distances)
    };
    return newList
    }

export function flattenDistanceCombinations(positions: number[]) {
    const newLst = mapDistanceCombinations(positions)
    const flatten = 
        newLst
        .map( (a) => concatResultsToRelative(a))
    return flatten
}
    