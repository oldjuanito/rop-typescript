// src/types/index.tsx
import {
    PrimitiveIdentifier,
    PrimitiveIdentifierConsts
} from '../commons/types/userDefinedFieldDefinition'
import { emptyEditTextFieldCurrVal, createTxtValueApplier, 
    UdfStore } from '../commons/editTypes/editTxtField'
import { RequiredChoice } from '../commons/types/requiredChoice'
import { RequiredShortAnswer } from '../commons/types/requiredShortAnswer'
import { RequiredAttachmentId } from '../commons/types/requiredAttachmentId'
import { RequiredPositiveMoney } from '../commons/types/requiredPositiveMoney'
import { RequiredFutureDate } from '../commons/types/requiredFutureDate'
import { RequiredLongAnswer } from '../commons/types/requiredLongAnswer'
import { RequiredPastDate } from '../commons/types/requiredPastDate'
import {List} from "immutable"

export interface StoreState {
    languageName: string
    enthusiasmLevel: number
    udfStores: List<UdfStore>
    // udfDescriptor: (bewVal: string) => EditTextFieldCurrVal
    // udfValues: EditTextFieldCurrVal[]
    // udfFields: UserDefinedFieldDefinition[]
}
function createFactory(primitiveType: PrimitiveIdentifier, choices: string[], propName: string) {

    switch (primitiveType) {
        case PrimitiveIdentifierConsts.Choices:
            const fromRendition = RequiredChoice.choicesConstructor(choices)
            return createTxtValueApplier({
                label: propName,
                fromRendition // RequiredShortAnswer.tryCreate
            })
        case PrimitiveIdentifierConsts.FileInput:
            return createTxtValueApplier({
                label: propName,
                fromRendition: RequiredAttachmentId.tryCreate
            })
        case PrimitiveIdentifierConsts.Money:
            return createTxtValueApplier({
                label: propName,
                fromRendition: RequiredPositiveMoney.tryCreate
            })
        case PrimitiveIdentifierConsts.FutureDate:
            return createTxtValueApplier({
                label: propName,
                fromRendition: RequiredFutureDate.tryCreate
            })
        case PrimitiveIdentifierConsts.PastDate:
            return createTxtValueApplier({
                label: propName,
                fromRendition: RequiredPastDate.tryCreate
            })
        case PrimitiveIdentifierConsts.MultiLineText:
            return createTxtValueApplier({
                label: propName,
                fromRendition: RequiredLongAnswer.tryCreate
            })
        default:
            return createTxtValueApplier({
                label: propName,
                fromRendition: RequiredShortAnswer.tryCreate
            })
    }
}
function createSample(propName: string, primitiveType: PrimitiveIdentifier) {

    // const propName = 'lolo'
    const choices = ['car', 'bus', 'train']
    const store: UdfStore = {
        udfDescriptor : createFactory(primitiveType, choices, propName),
        udfValue : emptyEditTextFieldCurrVal(propName),
        udfField : { label : propName, primitiveType, options : choices  }
    }
    return store
}

export function createSampleUdfStores() {
    return List([
        createSample('Explain product', PrimitiveIdentifierConsts.MultiLineText),
        createSample('Date of Produced', PrimitiveIdentifierConsts.PastDate),
        createSample('Date of Purchase', PrimitiveIdentifierConsts.FutureDate),
        createSample('Amount of Purchase', PrimitiveIdentifierConsts.Money),
        createSample('lol', PrimitiveIdentifierConsts.Choices),
        createSample('peter', PrimitiveIdentifierConsts.FileInput),
        createSample('name', PrimitiveIdentifierConsts.SingleLineText)
    ])
}