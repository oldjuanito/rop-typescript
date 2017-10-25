import { Descriptors } from './primitiveDescriptors'
import { startTrack } from '../rop/rop'

export module MultipleEntries {
    export const MAX_LEN = 20 
    const dataDescription: Descriptors.String = { 
        maxLen : MAX_LEN,
        minLen: 1,
        required: true
    }
    class T<PrimitiveType> {
        constructor(private value: PrimitiveType[]) {
        }
        getVal() { return this.value }
    } 
    export function tryCreate(initialVal: string) {
        return startTrack(Descriptors.validateString(dataDescription, initialVal))
            .map( (n) => new T(n))
            .getResult()
    }
}