import { BindingPath, CustomHashTypeDefinition, TypeDefinitionId, TypeDefinitionKind } from './types'

export function getBindingPathProp(contextType: CustomHashTypeDefinition,
                                   bindingPath: BindingPath ) {
        let currPointer = contextType.properties
        let currPropType: string = TypeDefinitionKind.InvalidType
        let propName = ''
        for (var pathStep = 0; pathStep < bindingPath.length; pathStep++) {
            const bindStep = bindingPath[pathStep]
            // console.log(bindStep)
            const currProp = currPointer[bindStep]
            currPropType = currProp.kind
            // console.log(currProp)
            if (!currProp) { 
                return {
                    kind: TypeDefinitionKind.InvalidType,
                    customTypeName: ''
                 }
            }
            
            if (currProp.kind === TypeDefinitionKind.CustomHashTypeDefinition) {
                currPointer = currProp.properties
            }
            if (currProp.kind === TypeDefinitionKind.CustomHashTypeDefinition 
                || currProp.kind === TypeDefinitionKind.CustomPrimitiveTypeDefinitionName) {
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

export function validateBindingPathWithType(contextType: CustomHashTypeDefinition,
                                            bindingPath: BindingPath,
                                            validType: TypeDefinitionId ) {
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
export function setValueInBindingPath(contextType: CustomHashTypeDefinition,
                                      bindingPath: BindingPath,
                                      contextData: {},
                                      newValueToAssign: {},
                                      append: boolean ) {
    if (bindingPath.length <= 0) {
        return
    }
    console.log('setValueInBindingPath: ' + JSON.stringify(newValueToAssign))
    const newValType = typeof newValueToAssign
    let contextPointer = contextData
    let currPathIdx = 0
    while (currPathIdx < bindingPath.length - 1) {
        contextPointer = contextPointer[bindingPath[currPathIdx]]
        currPathIdx++
    }
      
    if (newValueToAssign instanceof Date 
        ||  (newValType === 'number') 
        ||  (newValType === 'string') 
        ||  (newValType === 'boolean') 
    ) {
        contextPointer[bindingPath[currPathIdx]] = newValueToAssign
        return 
    }
    for (let inputKey in newValueToAssign) {
        if (newValueToAssign.hasOwnProperty(inputKey)) {
            // console.log('setValueInBindingPath: ' + JSON.stringify(inputKey))
            const valueToAssign = newValueToAssign[inputKey] 
            // console.log('setValueInBindingPath valueToAssign: ' + JSON.stringify(valueToAssign))
            if (Array.isArray(valueToAssign) && append) {
                contextPointer[bindingPath[currPathIdx]].concat(valueToAssign)
            } else {
                contextPointer[bindingPath[currPathIdx]] = valueToAssign
            }
        }
    }
}