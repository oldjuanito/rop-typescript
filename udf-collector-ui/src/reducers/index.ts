import { UdfStore } from '../commons/editTypes/editTxtField';
import { udfAction } from '../actions'
import { StoreState } from '../types/storeType'
import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM, FIELD_VAL_CHG } from '../constants/index'

// import { RequiredPositiveMoney } from '../commons/types/requiredPositiveMoney'

function enthusiasm(state: StoreState, action: udfAction): StoreState {
    // const myMoney = RequiredPositiveMoney.tryCreate(56)
    switch (action.type) {
        case INCREMENT_ENTHUSIASM:
            return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 }
        case DECREMENT_ENTHUSIASM:
            return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) }
        default:
            return state
    }
}
function fieldChg(state: StoreState, action: udfAction): StoreState {
    // const myMoney = RequiredPositiveMoney.tryCreate(56)

    switch (action.type) {
        case FIELD_VAL_CHG:
            const udfStore: UdfStore | undefined = state.udfStores.find((u) => u.udfField.label === action.fieldName)
            if (udfStore ) {
                const newSession = udfStore.udfDescriptor(action.payload)
                const newUdfStores = state.udfStores.map(function (u: UdfStore) {
                        if (u.udfField.label === newSession.label) {
                            return { ...u, udfValue: newSession }
                        } else {
                            return u
                        }
                    }
                )
                return { ...state, udfStores: newUdfStores }
            } else {
                return state
            }
        default:
            return state
    }
}

export default function combineReducers(state: StoreState, action: udfAction): StoreState {
    return fieldChg( enthusiasm(state, action), action)
}