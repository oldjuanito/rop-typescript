import { EditTextFieldCurrVal } from '../commons/editTypes/editTxtField'
import { PrimitiveIdentifierConsts, UserDefinedFieldDefinition } from '../commons/types/userDefinedFieldDefinition';
import * as React from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import { ChangeEventArgs } from '@syncfusion/ej2-dropdowns';

export interface Props {
    name: string
    enthusiasmLevel?: number
    onIncrement?: () => void
    onDecrement?: () => void
    onFieldValueChg: (label:  string, newVal:  string) => void
    udfValues: EditTextFieldCurrVal[]
    udfFields: UserDefinedFieldDefinition[]
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

function onDropDownChg(onFieldValueChg: (label:  string, newVal:  string) => void, label:  string) {
  return function (evt: ChangeEventArgs) {
    if (evt !== undefined && evt.item != null) {
      onFieldValueChg(label, evt.item.attributes.getNamedItem('data-value').value)
    }
  }
}

function createControlView(onFieldValueChg: (label:  string, newVal:  string) => void, udfDef: UserDefinedFieldDefinition , 
                           udfCurrVal: EditTextFieldCurrVal | undefined) {
  const key = udfDef.label + '_fld'
  const currVal = udfCurrVal ? udfCurrVal.currTxtVal : ''
  switch (udfDef.primitiveType) {
    case PrimitiveIdentifierConsts.Choices:
        return ( 
          <DropDownListComponent 
            id={key} 
            popupHeight="250px" 
            dataSource={udfDef.options} 
            placeholder="" 
            change={onDropDownChg(onFieldValueChg, udfDef.label)}
            text={currVal}
          />
        )
    default:
        return <input onChange={(evt) => onFieldValueChg(udfDef.label, evt.target.value)} /> 
}
     
}
function udfFieldView(onFieldValueChg: (label:  string, newVal:  string) => void, udfDef: UserDefinedFieldDefinition , 
                      udfCurrVal: EditTextFieldCurrVal | undefined) {
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
function Hello({ name, enthusiasmLevel = 1, onIncrement, onDecrement, onFieldValueChg, udfValues, udfFields }: Props) {
    if (enthusiasmLevel <= 0) {
      throw new Error('You could be a little more enthusiastic. :D')
    }
    
    console.log('render')
    return (
      <div className="hello">
        <div className="greeting">
          Hello {name + getExclamationMarks(enthusiasmLevel)}
        </div>
        <ButtonComponent type="primary">Button</ButtonComponent>
        {udfFields.map((def) => udfFieldView(onFieldValueChg, def, udfValues.find((u) => u.label === def.label) ) )}
        
        <div>
          <button onClick={onDecrement}>-</button>
          <button onClick={onIncrement}>+</button>
        </div>
      </div>
    )
  }
  
export default Hello

// helpers

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join('!')
}