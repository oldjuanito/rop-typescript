import { CustomerDomain, CustomerInput } from '../../shared/src/customer'
import { InputMsg } from '../../shared/src/commons/editTypes'

export interface CustomerEdit {
    readonly rendition: CustomerInput,
    readonly domain?: CustomerDomain
}

interface CustomerView {
    readonly lastName: HTMLInputElement,
}

export interface  CustomerScreen {
    readonly viewModel: CustomerEdit,
    readonly view: CustomerView
    readonly inputMsg: InputMsg,
}
