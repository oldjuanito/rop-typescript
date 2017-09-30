import { Validations, start , bindIf } from '../rop/rop'

export module Descriptors {

    export interface String {
        required: boolean
        minLen: number
        maxLen: number
    } 
    export interface PatternString {
        required: boolean
        minLen: number
        maxLen: number
        pattern: string
        patternErrMsg: string
    } 
    export interface Numeric {
        required: boolean
        minVal: number
        maxVal: number
    } 
    export interface Date {
        required: boolean
        minVal: Date
        maxVal: Date
    } 
    export interface Choice {
        required: boolean
        options: string[]
    } 

    export function validateNumber(descriptor: Numeric, subject: string | number) {
        const curriedIsWithinRange = 
            (subject2: number) => Validations.isWithinRange(descriptor.minVal, descriptor.maxVal, subject2)
        const result =
            start(bindIf(descriptor.required, Validations.hasValue, subject ))
            .then(Validations.tryNumber)
            .then(curriedIsWithinRange)
            .getResult()
        return result
    }
}