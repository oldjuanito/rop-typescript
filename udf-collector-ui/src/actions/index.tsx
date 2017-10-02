import * as constants from '../constants'

// Wrappers for constants??
export interface IncrementEnthusiasm {
    type: constants.INCREMENT_ENTHUSIASM
}

export interface DecrementEnthusiasm {
    type: constants.DECREMENT_ENTHUSIASM
}

export interface FieldValueChg {
    type: constants.FIELD_VAL_CHG
    payload: string
}

// DU
export type udfAction = IncrementEnthusiasm | DecrementEnthusiasm | FieldValueChg

// COnstructors for DU??
export function incrementEnthusiasm(): IncrementEnthusiasm {
    return {
        type: constants.INCREMENT_ENTHUSIASM
    }
}

export function decrementEnthusiasm(): DecrementEnthusiasm {
    return {
        type: constants.DECREMENT_ENTHUSIASM
    }
}

export function fieldValueChg(newVal: string): FieldValueChg {
    return {
        type: constants.FIELD_VAL_CHG,
        payload: newVal
    }
}
// There's clearly boilerplate here, https://www.npmjs.com/package/redux-actions
// so you should feel free to look into libraries like redux-actions once you've got the hang of things.