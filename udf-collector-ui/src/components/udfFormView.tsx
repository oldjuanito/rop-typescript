import { DispatcherFunc } from '../commons/elmish/elmishApp';
import { Msg, StoreState } from '../types/storeType';
import { DropDownSf } from '../commons/components/dropDownSf'
import { EditTextFieldCurrVal, UdfStore } from '../commons/editTypes/editTxtField'
import { PrimitiveIdentifierConsts, UserDefinedFieldDefinition } from '../commons/types/userDefinedFieldDefinition'
import * as React from 'react';
import { UploadBox } from '../commons/components/uploadBox'
import { NumericTextBoxComponent, ChangeEventArgs as NumericChangeEventArgs } from '@syncfusion/ej2-react-inputs'
import { DatePickerComponent, ChangeEventArgs as DateChangeEventArgs } from '@syncfusion/ej2-react-calendars'
import {List} from "immutable"
import { fieldValueChg } from '../actions/index';

export interface Props {
    name: string
    enthusiasmLevel?: number
    onIncrement?: () => void
    onDecrement?: () => void
    onFieldValueChg: (label:  string, newVal:  string) => void
    udfStores: List<UdfStore>
    // udfValues: EditTextFieldCurrVal[]
    // udfFields: UserDefinedFieldDefinition[]
  }
function errorItem(err: string) {
  return <li key={err} className="e-error"><i className="material-icons">&#xE000;</i> {err}</li>
}
function errorList(errs: string[]) {
  return (
    <ul className="prop-errors">
      {errs.map(errorItem)}
    </ul>
  )
}

function createControlView(onFieldValueChg: (label:  string, newVal:  string) => void, 
                           udfDef: UserDefinedFieldDefinition , 
                           udfCurrVal: EditTextFieldCurrVal | undefined) {
  // const key = udfDef.label + '_fld'
  const currVal = udfCurrVal ? udfCurrVal.currTxtVal : ''
  const caller = (newVal:  string) => onFieldValueChg(udfDef.label, newVal)
  const onFileRead = (fileName: string, binaryContents: string) => onFieldValueChg(udfDef.label, binaryContents)
  switch (udfDef.primitiveType) {
    case PrimitiveIdentifierConsts.Choices:
        return ( 
          <DropDownSf 
            onSelectionChange={caller}
            choices={udfDef.options}
            currVal={currVal}
          />
        )
    case PrimitiveIdentifierConsts.FileInput:
      return ( 
        <UploadBox 
          onFileRead={onFileRead}
        />
      )
    case PrimitiveIdentifierConsts.Money:
        return ( 
          <NumericTextBoxComponent  
            format="c2" 
            change={(evt: NumericChangeEventArgs) => 
              onFieldValueChg(udfDef.label, ((evt.value) ? evt.value : '').toString() )}
          />
        )
    case PrimitiveIdentifierConsts.FutureDate:
        return ( 
          <DatePickerComponent   
            min={new Date()} 
            max={new Date(9999, 12, 31)}
            
            change={(evt: DateChangeEventArgs) => 
              onFieldValueChg(udfDef.label, ((evt.value) ? evt.value : '').toString() )}
          />
        )
    case PrimitiveIdentifierConsts.PastDate:
        return ( 
          <DatePickerComponent   
            max={new Date()} 
            min={new Date(1900, 1, 1)}
            
            change={(evt: DateChangeEventArgs) => 
              onFieldValueChg(udfDef.label, ((evt.value) ? evt.value : '').toString() )}
          />
        )
    case PrimitiveIdentifierConsts.MultiLineText:
        return <textarea onChange={(evt) => onFieldValueChg(udfDef.label, evt.target.value)} />
    case PrimitiveIdentifierConsts.PositiveInteger:
        return (
          <NumericTextBoxComponent  
                  format="0" 
                  change={(evt: NumericChangeEventArgs) => 
                    onFieldValueChg(udfDef.label, ((evt.value) ? evt.value : '').toString() )}
          />
          )
    default:
        return <input onChange={(evt) => onFieldValueChg(udfDef.label, evt.target.value)} /> 
}
     
}
function udfFieldView(onFieldValueChg: (label:  string, newVal:  string) => void, udfDef: UserDefinedFieldDefinition , 
                      udfCurrVal: EditTextFieldCurrVal ) {
  const hasErrs = udfCurrVal && udfCurrVal.currErrors.length > 0
  const errs = (udfCurrVal as EditTextFieldCurrVal).currErrors
  return ( 
      <div key={udfDef.label} className="mui-textfield">
        {createControlView(onFieldValueChg, udfDef, udfCurrVal)}
        <label>{udfDef.label}</label>
        {(hasErrs) ? errorList(errs) : <span />} 
      </div>
  )

}
function UdfFormView({ name, enthusiasmLevel = 1, onIncrement, onDecrement, onFieldValueChg, udfStores }: Props) {
        
    return (
      <div className="udfFormView">
        {udfStores.map(({udfDescriptor, udfValue, udfField}) => udfFieldView(onFieldValueChg, udfField, udfValue) )}
        
      </div>
    )
  }
  
export function UdfFormViewBasic(store: StoreState, dispatcher: DispatcherFunc<Msg>) {
  const udfStores = store.udfStores
  const onFieldValueChg = 
    (label:  string, newVal:  string) => {
      const newMsg: Msg = fieldValueChg(label, newVal)
      dispatcher(newMsg)
    }
  return (
  <div className="udfFormView">
    {udfStores.map(({udfDescriptor, udfValue, udfField}) => udfFieldView(onFieldValueChg, udfField, udfValue) )}
    
  </div>
  )
}
export default UdfFormView
