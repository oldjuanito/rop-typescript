import { ComboBoxSf, DropDownSf, SampleFilterDrop } from '../commons/components/dropDownSf'
import { EditTextFieldCurrVal, UdfStore } from '../commons/editTypes/editTxtField';
import { PrimitiveIdentifierConsts, UserDefinedFieldDefinition } from '../commons/types/userDefinedFieldDefinition'
import * as React from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { UploadBox } from '../commons/components/uploadBox';

export interface Props {
    name: string
    enthusiasmLevel?: number
    onIncrement?: () => void
    onDecrement?: () => void
    onFieldValueChg: (label:  string, newVal:  string) => void
    udfStores: UdfStore[]
    // udfValues: EditTextFieldCurrVal[]
    // udfFields: UserDefinedFieldDefinition[]
  }
function errorItem(err: string) {
  return <li key={err} className="prop-error">{err}</li>
}
function errorList(errs: string[]) {
  return (
    <div className="prop-errors">
      {errs.map(errorItem)}
    </div>
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
    default:
        return <input onChange={(evt) => onFieldValueChg(udfDef.label, evt.target.value)} /> 
}
     
}
function udfFieldView(onFieldValueChg: (label:  string, newVal:  string) => void, udfDef: UserDefinedFieldDefinition , 
                      udfCurrVal: EditTextFieldCurrVal ) {
  const hasErrs = udfCurrVal && udfCurrVal.currErrors.length > 0
  const errs = (udfCurrVal as EditTextFieldCurrVal).currErrors
  return ( 
      <div key={udfDef.label}>
        <label>{udfDef.label}</label>
        {createControlView(onFieldValueChg, udfDef, udfCurrVal)}
        {(hasErrs) ? errorList(errs) : <span />} 
      </div>
  )

}
function Hello({ name, enthusiasmLevel = 1, onIncrement, onDecrement, onFieldValueChg, udfStores }: Props) {
    if (enthusiasmLevel <= 0) {
      throw new Error('You could be a little more enthusiastic. :D')
    }
    
    const sampleCaller = (newVal:  string) => console.log('hello ' + newVal) 
    const sampleOpts = ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis']
    console.log('render')
    return (
      <div className="hello">
        <div className="greeting">
          Hello {name + getExclamationMarks(enthusiasmLevel)}
        </div>
        <ButtonComponent type="primary">Button</ButtonComponent>
        {udfStores.map(({udfDescriptor, udfValue, udfField}) => udfFieldView(onFieldValueChg, udfField, udfValue) )}
        
        <div>
          <button onClick={onDecrement}>-</button>
          <button onClick={onIncrement}>+</button>
        </div>
        <SampleFilterDrop />
          <ComboBoxSf 
            onSelectionChange={sampleCaller}
            choices={sampleOpts}
            currVal={'Football'}
          />
      </div>
    )
  }
  
export default Hello

// helpers

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join('!')
}