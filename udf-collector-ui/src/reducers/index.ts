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
            // TODO: ignore if curr value same as old?? Syncfusion drop downs not liking it, maybe create samrt wrapper for them per the docs with the refs
            const newSession = state.udfDescriptor(action.payload)
            // console.log(newSession)
            const newUdfValues = state.udfValues.map((u) => u.label === newSession.label ? newSession : u)
           
            console.log(newUdfValues)
            return { ...state, udfValues: newUdfValues }
        default:
            return state
    }
}

export default function combineReducers(state: StoreState, action: udfAction): StoreState {
    return fieldChg( enthusiasm(state, action), action)
}