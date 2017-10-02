import * as React from 'react'
import * as ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import { createTxtValueApplier } from './commons/editTypes/editTxtField'
import { RequiredShortAnswer } from './commons/types/requiredShortAnswer'

import { createStore } from 'redux'
import reducer from './reducers/index'
import { StoreState } from './types/index'
import Hello from './containers/hello'
import { Provider } from 'react-redux'
import './App.css'

const udfDesc = createTxtValueApplier({
  label: 'lolo',
  fromRendition: RequiredShortAnswer.tryCreate
})
const store = createStore<StoreState>(reducer, {
  enthusiasmLevel: 1,
  languageName: 'TypeScript',
  udfDescriptor: udfDesc
})

ReactDOM.render(
  <Provider store={store}>
    <Hello />
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
