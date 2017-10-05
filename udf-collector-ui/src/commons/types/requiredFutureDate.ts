import { Descriptors } from './primitiveDescriptors'
import { startTrack } from '../rop/rop'

export module RequiredFutureDate {
    const dataDescription: Descriptors.DateDesc = { 
        maxVal : new Date(9999, 12, 31),
        minVal: new Date(),
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