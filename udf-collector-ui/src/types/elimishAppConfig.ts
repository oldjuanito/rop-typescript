import { UdfStore } from '../commons/editTypes/editTxtField'
import { UdfFormViewBasic } from '../components/udfFormView'
import { createSampleUdfStores, Msg, StoreState } from './storeType'
import { ElmishApp, InitFunc, UpdateFunc, ViewFunc } from '../commons/elmish/elmishApp';

const initialStore: StoreState = {
    enthusiasmLevel: 1,
    languageName: 'TypeScript',
    udfStores: createSampleUdfStores()
  }
const initFunc: InitFunc<StoreState> = () => initialStore

function updateStateFromUdfVal(udfStoreIdx: number, action: Msg, state: StoreState) {
    const newUdfStores = state.udfStores.update(udfStoreIdx, function (u: UdfStore) {
                return {...u, udfValue: u.udfDescriptor(action.payload)}
        }
    )
    return newUdfStores
}
const updateFunc: UpdateFunc<StoreState, Msg> = 
    (state, newMsg) => {
        const udfStoreIdx = state.udfStores.findIndex((u) => u ? u.udfField.label === newMsg.fieldName : false )
        if (udfStoreIdx >= 0) {
            const newUdfStores = updateStateFromUdfVal(udfStoreIdx, newMsg, state)
            return [{ ...state, udfStores: newUdfStores }, []]
        } else {
            return [ state, [] ]
        }
    }
const viewFUnc: ViewFunc<StoreState, Msg> = 
    (dispatcher, newState) => {
            return UdfFormViewBasic(newState, dispatcher)
        }

export const udfApp = new ElmishApp<StoreState, Msg>(initFunc, updateFunc, viewFUnc)
