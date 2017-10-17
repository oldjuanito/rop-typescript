import { startTrack, Validations } from '../rop/rop'

export module RequiredAttachmentId {
    
    class T {
        constructor(private value: string) {
        }
        getVal() { return this.value }
    } 
    export function tryCreate(initialVal: string) {
        const result =
            startTrack(Validations.hasValue(initialVal))
            .map( (n) => new T(n))
            .getResult()
        return result
    }
}