import * as React from 'react'
import * as ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import { createStore } from 'redux'
import reducer from './reducers/index'
import { createSampleUdfStores, StoreState } from './types/storeType'
import UdfForm from './containers/udfForm'
import { Provider } from 'react-redux'
import './App.css'

const store = createStore<StoreState>(reducer, {
  enthusiasmLevel: 1,
  languageName: 'TypeScript',
  udfStores: createSampleUdfStores()
})

ReactDOM.render(
  <Provider store={store}>
    <UdfForm />
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
