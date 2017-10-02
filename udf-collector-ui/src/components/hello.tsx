import * as React from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'

export interface Props {
    name: string
    enthusiasmLevel?: number
    onIncrement?: () => void
    onDecrement?: () => void
    onFieldValueChg: (newVal:  string) => void
  }

function Hello({ name, enthusiasmLevel = 1, onIncrement, onDecrement, onFieldValueChg }: Props) {
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
        <input onChange={(evt) => onFieldValueChg(evt.target.value)} />
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