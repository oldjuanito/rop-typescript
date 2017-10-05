import UdfFormView from '../components/udfFormView'
import * as actions from '../actions'
import { StoreState } from '../types/storeType'
import { connect, Dispatch } from 'react-redux'

export function mapStateToProps({ enthusiasmLevel, languageName, udfStores }: StoreState) {
    return {
      enthusiasmLevel,
      name: languageName,
      udfStores
    }
  }

export function mapDispatchToProps(dispatch: Dispatch<actions.udfAction>) {
    return {
      onIncrement: () => dispatch(actions.incrementEnthusiasm()),
      onDecrement: () => dispatch(actions.decrementEnthusiasm()),
      onFieldValueChg: (fieldName: string, newVal:  string) => dispatch(actions.fieldValueChg(fieldName, newVal))
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(UdfFormView)