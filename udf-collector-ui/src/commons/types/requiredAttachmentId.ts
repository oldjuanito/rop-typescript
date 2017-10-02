import { Descriptors } from './primitiveDescriptors'
import { startTrack } from '../rop/rop'

export module RequiredAttachmentId {
    const dataDescription: Descriptors.Numeric = { 
        maxVal : Number.MAX_VALUE,
        minVal: 1,
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
            .map( (n) => new T(n))
            .getResult()
        return result
    }
}