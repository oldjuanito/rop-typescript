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

export interface CustomHashTypeDefinition {
    readonly name:string
    readonly properties: TypeDefinition[]
}

export type TypeDefinition =  
    CustomHashTypeDefinition 
    | CustomPrimitiveTypeDefinition
    | BasePrimitiveType
    | BaseCollectionType
