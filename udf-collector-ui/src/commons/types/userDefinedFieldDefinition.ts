export const enum PrimitiveIdentifierConsts {
    SingleLineText  = 'SingleLineText' ,
    Money  = 'Money',
    MultiLineText  = 'MultiLineText',
    FileInput  = 'FileInput',
    Choices = 'Choices' 
}

type PrimitiveIdentifier = 
    PrimitiveIdentifierConsts.Choices 
    | PrimitiveIdentifierConsts.FileInput 
    | PrimitiveIdentifierConsts.Money 
    | PrimitiveIdentifierConsts.MultiLineText 
    | PrimitiveIdentifierConsts.SingleLineText

export interface UserDefinedFieldDefinition {
    label: string ,
    primitiveType:  PrimitiveIdentifier
} 

// const te : UserDefinedFieldDefinition = { label: 'aj', primitiveType : PrimitiveIdentifierConsts.MultiLineText  }