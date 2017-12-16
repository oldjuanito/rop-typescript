export interface CustomerInput {
    lastName: string
}
export interface CustomerDomain {
    lastName: string
}

export function greetCustomer(cust:CustomerDomain) {
    return `Hi ${cust.lastName}!!!`
}