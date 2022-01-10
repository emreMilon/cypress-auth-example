// ***********************************************************
// This example support/index.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import {fillForm} from './commands/fillForm'
import {checkPostApiMessage} from './commands/checkPostApiMessage'
import {checkPrice} from './commands/checkPrice'
import {clickElement} from './commands/clickElement'

Cypress.Commands.add('fillForm', fillForm)
Cypress.Commands.add('checkPostApiMessage', checkPostApiMessage)
Cypress.Commands.add('checkPrice', checkPrice)
Cypress.Commands.add('clickElement', clickElement)



