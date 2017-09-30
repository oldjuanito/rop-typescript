import { Descriptors } from './primitiveDescriptors'
import { Validations, start } from '../rop/rop'

export module BusinessTypes {

    const requiredPositiveMoney: Descriptors.Numeric = { 
        maxVal : Number.MAX_VALUE,
        minVal: 0,
        required: true
    }

    class RequiredPositiveMoney {
        constructor(private value: number) {
        }
    } 

    export function tryRequiredPositiveMoney(initialVal: number | string) {
        const result =
            start(Descriptors.validateNumber(requiredPositiveMoney, initialVal))
            .then( (n) => 

            )
            .getResult()
        return result
    }
}

