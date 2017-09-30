import * as constants from '../constants'

// Wrappers for constants??
export interface IncrementEnthusiasm {
    type: constants.INCREMENT_ENTHUSIASM
}

export interface DecrementEnthusiasm {
    type: constants.DECREMENT_ENTHUSIASM
}

// DU
export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm

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

// There's clearly boilerplate here, https://www.npmjs.com/package/redux-actions
// so you should feel free to look into libraries like redux-actions once you've got the hang of things.