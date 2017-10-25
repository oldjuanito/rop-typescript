import { Descriptors } from './primitiveDescriptors'
import { startTrack, Validations } from '../rop/rop'

export module RequiredPositiveInteger {
    const dataDescription: Descriptors.Numeric = { 
        maxVal : Number.MAX_VALUE,
        minVal: 0,
        required: true
    }
    class T {
        constructor(private value: number) {
        }
        getVal() { return this.value }
    } 
    export function tryCreate(initialVal: number | string) {
        const result =
            startTrack(Descriptors.validateNumber(dataDescription, initialVal))
            .then(Validations.isInteger)
            .map( (n) => new T(n))
            .getResult()
        return result
    }
}