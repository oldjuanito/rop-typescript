import { UserDefinedFieldDefinition, PrimitiveIdentifierConsts } from './commons/types/userDefinedFieldDefinition'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import { createTxtValueApplier, emptyEditTextFieldCurrVal } from './commons/editTypes/editTxtField'
// import { RequiredShortAnswer } from './commons/types/requiredShortAnswer'

import { createStore } from 'redux'
import reducer from './reducers/index'
import { StoreState } from './types/storeType'
import Hello from './containers/hello'
import { Provider } from 'react-redux'
import './App.css'
import { RequiredChoice } from './commons/types/requiredChoice'

const propName = 'lolo'
const choices = ['car', 'bus', 'train']
const udfDesc = createTxtValueApplier({
  label: propName,
  fromRendition: RequiredChoice.choicesConstructor(choices) // RequiredShortAnswer.tryCreate
})
const udfMap = [ emptyEditTextFieldCurrVal(propName)]

const udfFields: UserDefinedFieldDefinition[] = [
  { label : propName, primitiveType : PrimitiveIdentifierConsts.Choices, options : choices  }
  // { label : propName, primitiveType : PrimitiveIdentifierConsts.MultiLineText, options : []  }
]
const store = createStore<StoreState>(reducer, {
  enthusiasmLevel: 1,
  languageName: 'TypeScript',
  udfDescriptor: udfDesc,
  udfValues: udfMap,
  udfFields
})

ReactDOM.render(
  <Provider store={store}>
    <Hello />
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
