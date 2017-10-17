import registerServiceWorker from './registerServiceWorker'
import './App.css'
import { udfApp } from './types/elimishAppConfig'

const rootElem =  document.getElementById('root') as HTMLElement
udfApp.start(rootElem)
registerServiceWorker()
