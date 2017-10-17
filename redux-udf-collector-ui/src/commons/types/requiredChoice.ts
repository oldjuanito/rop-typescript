import { Descriptors } from './primitiveDescriptors'
import { PropertyError, RopResult, startTrack } from '../rop/rop'

export module RequiredChoice {
    export function choicesConstructor(choices: string[]) {
        const dataDescription: Descriptors.Choice = { 
            options: choices,
            required: true
        }
        class T {
            constructor(private value: string) {
            }
            getVal() { return this.value }
        } 
        return function tryCreate(initialVal: string): RopResult<T, PropertyError> {
            return startTrack(Descriptors.validateChoice(dataDescription, initialVal))
                .map( (n) => new T(n))
                .getResult()
        }
    }
}