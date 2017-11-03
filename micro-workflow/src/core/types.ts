export type BasePrimitiveType =
    'string'
    | 'number'
    | 'Date'
    
export type BaseCollectionType =
    'array'

export interface BasePrimitiveTypeDefinition {
    readonly kind: 'string' | 'number' | 'Date'
}
// export const BaseCollectionTypeDefinitionName = 'BaseCollectionTypeDefinition'
// export const CustomPrimitiveTypeDefinitionName = 'CustomPrimitiveTypeDefinition'
export enum TypeDefinitionKind {
    BaseCollectionTypeDefinitionName = 'BaseCollectionTypeDefinition',
    CustomPrimitiveTypeDefinitionName = 'CustomPrimitiveTypeDefinition' , 
    CustomHashTypeDefinition = 'CustomHashTypeDefinition',
    BaseString = 'string',
    BaseNumber = 'number',
    BaseDate =  'Date',
    InvalidType = 'INVALID'
} 
export interface BaseCollectionTypeDefinition {
    readonly kind: TypeDefinitionKind.BaseCollectionTypeDefinitionName
}

export interface CustomPrimitiveTypeDefinition {
    readonly kind: TypeDefinitionKind.CustomPrimitiveTypeDefinitionName
    readonly name:string
    readonly basePrimitiveType: BasePrimitiveType
}

interface PropertiesHash {
    readonly [properties:string]:  TypeDefinition
}
export interface CustomHashTypeDefinition {
    readonly kind: TypeDefinitionKind.CustomHashTypeDefinition
    readonly name:string,
    readonly properties:  PropertiesHash
}

export type BindingPath = string[]
export type TypeDefinition =  
    CustomHashTypeDefinition 
    | CustomPrimitiveTypeDefinition
    | BasePrimitiveTypeDefinition
    | BaseCollectionTypeDefinition

export function GetDateValue(bindingPath: BindingPath, 
    currDataContext:{} ) {
        let currPointer = currDataContext;
        for (var pathStep = 0; pathStep < bindingPath.length; pathStep++) {
            currPointer = currPointer[bindingPath[pathStep]];
        }
        return <Date>currPointer;
    }

export interface FunctionInputDefinition {
    readonly name: string
    readonly inputType: TypeDefinition
}

interface InputBindingsHash {
    readonly [inputs:string]:  BindingPath
}

export interface WorkflowStepInstanceDefinition {
    readonly functionDefId: string
    readonly inputBindings: InputBindingsHash
    readonly ReplaceContext: boolean
    readonly DoWhenOutputPathExists: 'replace' | 'append'
}

export interface TypeDefinitionId {
    readonly kind: TypeDefinitionKind
    readonly customTypeName: string
}
/*
a function needs a wrapper defintion that provides the inputs required
    - a readonly public inputdefinitions hash describing the input to expect
    - APply function given a hash of the expected outpust, keys by input name
an instance defines a step placed int he workflow and its input/output mapping

workflow engine checks the validity of the binding path and its leaf type being compat with the input
*/