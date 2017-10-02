// src/types/index.tsx
import { UserDefinedFieldDefinition } from '../commons/types/userDefinedFieldDefinition';
import { EditTextFieldCurrVal } from '../commons/editTypes/editTxtField'

export interface StoreState {
    languageName: string
    enthusiasmLevel: number
    udfDescriptor: (bewVal: string) => EditTextFieldCurrVal
    udfValues: EditTextFieldCurrVal[]
    udfFields: UserDefinedFieldDefinition[]
}