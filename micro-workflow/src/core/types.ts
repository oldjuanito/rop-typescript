export type BasePrimitiveType =
    'string'
    | 'number'
    | 'Date'
    
export type BaseCollectionType =
    'array'

export interface CustomPrimitiveTypeDefinition {
    readonly name:string
    readonly basePrimitiveType: BasePrimitiveType
}

interface PropertiesHash {
    readonly [properties:string]:  TypeDefinition
}
export interface CustomHashTypeDefinition {
    readonly name:string,
    readonly properties:  PropertiesHash
}

export type BindingPath = string[]
export type TypeDefinition =  
    CustomHashTypeDefinition 
    | CustomPrimitiveTypeDefinition
    | BasePrimitiveType
    | BaseCollectionType

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

export function validateBindingPath(contextType: CustomHashTypeDefinition,
    bindingPath: BindingPath ) {
        let currPointer = contextType.properties;
        for (var pathStep = 0; pathStep < bindingPath.length; pathStep++) {
            const currProp = currPointer[bindingPath[pathStep]];
            if (!currProp) { //is undefined??
                return false
            }
        }
        return true
    }
export function validateBindingPathWithType(contextType: CustomHashTypeDefinition,
    bindingPath: BindingPath,
    validType:CustomPrimitiveTypeDefinition ) {
        let currPointer = contextType.properties
        let currProp = null
        for (var pathStep = 0; pathStep < bindingPath.length; pathStep++) {
            currProp = currPointer[bindingPath[pathStep]];
            if (!currProp) { //is undefined??
                return false
            }
        }
        if (currProp == TypeDefinition) 
        // how to check if it is eehter a CustomPrimitiveTypeDefinition or Collection
        if (CustomPrimitiveTypeDefinition) {
            const primType:CustomPrimitiveTypeDefinition = currProp
            return primType.name == validType.name
        }
        if (BaseCollectionType && validType == BaseCollectionType)
            return true

    }
/*
a function needs a wrapper defintion that provides the inputs required
    - a readonly public inputdefinitions hash describing the input to expect
    - APply function given a hash of the expected outpust, keys by input name
an instance defines a step placed int he workflow and its input/output mapping

workflow engine checks the validity of the binding path and its leaf type being compat with the input
*/