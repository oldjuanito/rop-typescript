import { UpdateFormFromTextMsg } from '../../updateFormFromTextMsg'
import { ExecDbStep } from '../../execDbStep'
import { DateMustBeLessStep } from '../../dateMustBeLessStep'
import {
    BaseString,
    CustomHashTypeDefinition,
    CustomPrimitiveTypeDefinition,
    PastDateType,
    PositiveMoney,
    PropertiesHash,
    ShortAnswer,
    TypeDefinitionHash,
    TypeDefinitionKind,
} from '../../types';
import { FuncDefinitionHash} from '../../workflowStep';



export const blogEntryType: CustomHashTypeDefinition = {
    kind: TypeDefinitionKind.CustomHashTypeDefinition,
    name: 'BlogEntry',
    properties: {
        'DateCreated': PastDateType,
        'DateModified': PastDateType,
        // 'WasSaved' : BaseBoolean
    }
}
export const contextType: CustomHashTypeDefinition = {
    // notice the root always wrap custom ones
    kind: TypeDefinitionKind.CustomHashTypeDefinition,
    name: 'root',
    properties: {
        'blogEntry': blogEntryType
    }
}

export const MsgType: CustomHashTypeDefinition = {
    kind: TypeDefinitionKind.CustomHashTypeDefinition,
    name: 'MsgType',
    properties: {
        'NewValue': BaseString,
        'FieldName': BaseString
    }
}
// this might be created at runtime from the list of udfs given by
//   user:
export const myFormFields: CustomHashTypeDefinition = {
    kind: TypeDefinitionKind.CustomHashTypeDefinition,
    name: 'myFormFields',
    properties: {
        'Name1': ShortAnswer,
        'DateModified': PastDateType,
        'ToPay': PositiveMoney,
    }
}
export const myFormLabels: CustomHashTypeDefinition = {
    kind: TypeDefinitionKind.CustomHashTypeDefinition,
    name: 'myFormLabels',
    properties: {
        'Name1': BaseString,
        'DateModified': BaseString,
        'ToPay': BaseString,
    }
}
export const myForm: CustomHashTypeDefinition = {
    kind: TypeDefinitionKind.CustomHashTypeDefinition,
    name: 'FormWithUdfs',
    properties: {
        'FieldValues': myFormFields,
        'FieldNames': myFormLabels
    }
}

export const globalFuncDefs: FuncDefinitionHash = {
    'UpdateFormFromTextMsg': UpdateFormFromTextMsg,
    'DateMustBeLessStep': DateMustBeLessStep,
    'ExecDbStep': ExecDbStep
}
export const globalCustomTypeDefs: TypeDefinitionHash = {
    'PastDateType': PastDateType,
    'ShortAnswer': ShortAnswer,
    'PositiveMoney': PositiveMoney,

    // the following would have been added at runtime by the engine
    'myFormFields': myFormFields,
    'myFormLabels': myFormLabels,
    'myForm': myForm
}
