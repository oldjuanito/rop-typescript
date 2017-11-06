import {CustomHashTypeDefinition, TypeDefinitionKind} from "../../types";
import {PastDateType} from '../../workflowStep'

export const blogEntryType: CustomHashTypeDefinition = {
    kind: TypeDefinitionKind.CustomHashTypeDefinition,
    name: 'BlogEntry',
    properties:  {
        'DateCreated' : PastDateType,
        'DateModified' : PastDateType
    }
}
export const contextType: CustomHashTypeDefinition = {
    //notice the root always wrap custom ones
    kind: TypeDefinitionKind.CustomHashTypeDefinition,
    name: 'root',
    properties:  {
        'blogEntry' : blogEntryType
    }
}