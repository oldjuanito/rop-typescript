import { UdfStore } from '../commons/editTypes/editTxtField';
import {FieldValueChg, udfAction} from '../actions'
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

function updateStateFromUdfVal(udfStoreIdx: number, action: FieldValueChg, state: StoreState) {
    const newUdfStores = state.udfStores.update(udfStoreIdx, function (u: UdfStore) {
                return {...u, udfValue: u.udfDescriptor(action.payload)}
        }
    )
    return newUdfStores;
}

function fieldChg(state: StoreState, action: udfAction): StoreState {
    // const myMoney = RequiredPositiveMoney.tryCreate(56)

    switch (action.type) {
        case FIELD_VAL_CHG:
            const udfStoreIdx = state.udfStores.findIndex((u) => u ? u.udfField.label === action.fieldName : false )
            if (udfStoreIdx >= 0) {
                const newUdfStores = updateStateFromUdfVal(udfStoreIdx, action, state);
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