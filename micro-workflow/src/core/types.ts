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

export function getBindingPathProp(contextType: CustomHashTypeDefinition,
    bindingPath: BindingPath ) {
        let currPointer = contextType.properties;
        let currPropType: string = TypeDefinitionKind.InvalidType
        let propName = ''
        for (var pathStep = 0; pathStep < bindingPath.length; pathStep++) {
            const bindStep = bindingPath[pathStep]
            // console.log(bindStep)
            const currProp = currPointer[bindStep];
            currPropType = currProp.kind
            // console.log(currProp)
            if (!currProp) { //is undefined??
                return {
                    kind: TypeDefinitionKind.InvalidType,
                    customTypeName: ''
                 }
            }
            
            if (currProp.kind === TypeDefinitionKind.CustomHashTypeDefinition) {
                currPointer = currProp.properties
            }
            if (currProp.kind === TypeDefinitionKind.CustomHashTypeDefinition || currProp.kind === TypeDefinitionKind.CustomPrimitiveTypeDefinitionName) {
                propName = currProp.name
            }
        }
        return {
            kind: currPropType,
            customTypeName: propName
         }
    }
export function validateBindingPath(contextType: CustomHashTypeDefinition,
    bindingPath: BindingPath ) {
        const leafKind = getBindingPathProp(contextType, bindingPath).kind
        return leafKind !== TypeDefinitionKind.InvalidType
    }
export interface TypeDefinitionId {
    readonly kind: TypeDefinitionKind
    readonly customTypeName: string
}

export function validateBindingPathWithType(contextType: CustomHashTypeDefinition,
    bindingPath: BindingPath,
    validType:TypeDefinitionId ) {
        const leafTypeId = getBindingPathProp(contextType, bindingPath)
        // console.log(currProp.kind)
        switch (leafTypeId.kind) {
            case TypeDefinitionKind.CustomPrimitiveTypeDefinitionName:
                return leafTypeId.customTypeName === validType.customTypeName
            case TypeDefinitionKind.BaseCollectionTypeDefinitionName:
                return validType.kind === TypeDefinitionKind.BaseCollectionTypeDefinitionName
            default:
                return false
        }
    }
/*
a function needs a wrapper defintion that provides the inputs required
    - a readonly public inputdefinitions hash describing the input to expect
    - APply function given a hash of the expected outpust, keys by input name
an instance defines a step placed int he workflow and its input/output mapping

workflow engine checks the validity of the binding path and its leaf type being compat with the input
*/