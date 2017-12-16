import { Customer, greetCustomer } from '../../shared/src/customer'

const newCust:Customer = { lastName: 'Tarquino'}

console.log(greetCustomer(newCust) + ' from browser')