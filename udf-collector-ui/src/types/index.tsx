// src/types/index.tsx
import { EditTextFieldCurrVal } from '../commons/editTypes/editTxtField'

export interface StoreState {
    languageName: string
    enthusiasmLevel: number
    udfDescriptor: (bewVal: string) => EditTextFieldCurrVal
}