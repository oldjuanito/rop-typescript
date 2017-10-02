import Hello from '../components/hello'
import * as actions from '../actions/'
import { StoreState } from '../types/storeType'
import { connect, Dispatch } from 'react-redux'

export function mapStateToProps({ enthusiasmLevel, languageName, udfFields, udfValues }: StoreState) {
    return {
      enthusiasmLevel,
      name: languageName,
      udfFields,
      udfValues
    }
  }

export function mapDispatchToProps(dispatch: Dispatch<actions.udfAction>) {
    return {
      onIncrement: () => dispatch(actions.incrementEnthusiasm()),
      onDecrement: () => dispatch(actions.decrementEnthusiasm()),
      onFieldValueChg: (fieldName: string, newVal:  string) => dispatch(actions.fieldValueChg(fieldName, newVal))
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Hello)