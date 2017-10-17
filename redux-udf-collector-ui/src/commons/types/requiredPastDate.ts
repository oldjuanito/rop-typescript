import { Descriptors } from './primitiveDescriptors'
import { startTrack } from '../rop/rop'

export module RequiredPastDate {
    const dataDescription: Descriptors.DateDesc = { 
        maxVal : new Date(),
        minVal: new Date(1900, 1, 1),
        required: true
    }
    class T {
        constructor(private value: Date) {
        }
        getVal() { return this.value }
    } 
    export function tryCreate(initialVal: string) {
        const result =
            startTrack(Descriptors.validateDate(dataDescription, initialVal))
            .map( (n) => new T(n))
            .getResult()
        return result
    }
}