import { Descriptors } from './primitiveDescriptors'
import { startTrack } from '../rop/rop'

export module RequiredChoice {
    export const MAX_LEN = 1024 
    const dataDescription: Descriptors.String = { 
        maxLen : MAX_LEN,
        minLen: 1,
        required: true
    }
    class T {
        constructor(private value: string) {
        }
        getVal() { return this.value }
    } 
    export function tryCreate(initialVal: string) {
        return startTrack(Descriptors.validateString(dataDescription, initialVal))
            .map( (n) => new T(n))
            .getResult()
    }
}