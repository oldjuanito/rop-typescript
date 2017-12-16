import { EditProp } from '../editTypes'


export interface EditPropHash {
    [propName: string]: EditProp<{}>
}