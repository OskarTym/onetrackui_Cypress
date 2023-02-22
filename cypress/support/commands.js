// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })



const {
  PageElements
} = require("../support/selectors")

const pe = new PageElements()

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


Cypress.Commands.add('login', (email, password) => {
  cy.get(pe.email_input).clear().type(email)
  cy.get(pe.password_input).clear().type(password)
  cy.get(pe.submitLogin_btn).should('not.be.disabled')
  cy.get(pe.loginForm).submit()
  cy.location('pathname').should('eq', '/mapsTab')
})

Cypress.Commands.add('loginFormValidation_UI', () => {
  cy.get(pe.loginForm).should('be.visible')
  cy.get(pe.loginForm_title).should('have.text', 'Login to Account')
  cy.get(pe.email_input).should('be.visible').and('have.attr', 'placeholder', 'Email or Username')
  cy.get(pe.password_input).should('be.visible').and('have.attr', 'placeholder', 'Your password')
  cy.get(pe.submitLogin_btn).should('be.disabled')
  cy.get(pe.forgotPass_btn).should('be.visible')
})

Cypress.Commands.add('elementIsVisible', (element) => {
  cy.get(element).should('be.visible')
})


Cypress.Commands.add('navigateTo', (root) => {
  cy.get(pe.header_menu).contains(root).click()
  cy.location().should((loc) => {
    switch (root) {
      case 'Map':
        expect(loc.pathname).to.eq('/mapsTab')
        break

      case 'Customer':
        expect(loc.pathname).to.eq('/crmTab/list')
        break

      case 'Estimates':
        expect(loc.pathname).to.eq('/estimatesTab/list')
        break

      case 'Schedule':
        expect(loc.pathname).to.eq('/schedulingTab')
        break

      case 'Invoices':
        expect(loc.pathname).to.eq('/invoicesTab/list')
        break

      case 'Timesheet':
        expect(loc.pathname).to.eq('/timesheetTab')
        break

      case 'SnowTrack':
        expect(loc.pathname).to.eq('/snowplowTab')
        break

      case 'P.O.':
        expect(loc.pathname).to.eq('/purchaseOrderTab')
        break

      case 'Reports':
        expect(loc.pathname).to.eq('/reportsTab')
        break

      default:
        break
    }
  })
})


Cypress.Commands.add('createNewInvoice', (customerName, itemsCount, discountType, discount) => {

  cy.get(pe.addNewInvoice_btn).click({
    force: true
  })
  cy.wait(3000)
  cy.get('input').type(customerName)

  cy.intercept('POST', 'https://onetrackwebapi.azurewebsites.net/api/AddressBooks/AddressBookLiveSearchExt').as('customers')
  // Customers LOADED
  cy.wait('@customers').its('response.statusCode').should('eq', 200)

  cy.get(pe.customerList).its('children').then((cus) => {
    cy.log(cus.length)
  })

  cy.get(`${pe.customerList} > li`).eq(0).click({
    force: true
  })
  cy.get(pe.proceed_btn).click()

  cy.intercept('POST', 'https://onetrackwebapi.azurewebsites.net/api/Inventory/GetInventoriesExt').as('itemAdded')


  // Add N-items to Invoice

  Cypress._.times(itemsCount, () => {

    // Add item by name -> eq(1) input
    cy.get(pe.itemProps).eq(1).click()

    cy.get('.cdk-overlay-pane > div > .mat-option').its('length').then((len) => {

      cy.log(`Items found: ${len}`)

      // (len - 1) to avoid [create new item] option
      cy.get('.cdk-overlay-pane > div > .mat-option').eq(getRandomInt(len-1)).click()

    })

    // Item successfully added
    cy.wait('@itemAdded').its('response.statusCode').should('eq', 200)

    // Verifying if there are duplicates in the added items
    cy.wait(2000)
    cy.get("body").then($body => {
      if ($body.find('.warningModal').length > 0) {
        cy.log('Duplicated Item!')
        cy.get('.warningModal').contains('Yes').click()
      } else {
        cy.log('No Duplicated Items!')
      }
    });


  })


  // ------ Discount to ITEM --------------------------------

  /*

  cy.get('.dataTables-example > tbody > tr').then((items) => {

    cy.get(items).eq(items.length - 1).then(() => {

      cy.get(`.dataTables-example > tbody > tr > td`).eq(8).contains('Add').click()

      cy.get('#modalAddDiscountPartLine >>>>>>>> input').clear().type(discount)
      cy.get('#modalAddDiscountPartLine >>>> .btn').contains('Save').click()
      //cy.get('#modalAddDiscountPartLine >>>> form').submit()

    })
  })

  */

  // ---------------------------------------------------------

  // ------ Discount to INVOICE ------------------------------

  cy.get('.invoice-total > tbody > tr').eq(1).then((row) => {

    cy.wrap(row).within(() => {
      cy.get('td').eq(1).contains('Add').click()
    })

    cy.get('#modalAddDiscount >>> .modal-body > form >>>> select').then((dt) => {

      expect(discountType).to.be.oneOf(['%','$'])

      switch (discountType) {
        case '%':
          cy.get(dt).select(0)
          break;

        case '$':
          cy.get(dt).select(1)
          break;

        default:
          break;
      }
    })
    cy.get('#modalAddDiscount >>>>>>>> input').clear().type(discount)
    cy.get('#modalAddDiscount >>>> .btn').contains('Save').click()
  })
  // ---------------------------------------------------------

  // Get total price after discount

  /*
  cy.get('.invoice-total > tbody > tr:nth-child(5)')
  .within(() => {
    cy.get('td').eq(1)
      .invoke('text')
      .then((text) => {
        const tp = parseFloat(text.match(/[-+]?[0-9]*\.?[0-9]+/g)[0]);
        cy.log(tp);
        totalPrices.push(tp);
      });
  });
   */

  cy.get('.invoice-total > tbody > tr').eq(4).then((row) => {
    cy.wrap(row).within(() => {
      cy.get('td').eq(1).then((el) => {

        let stp = el.text()

        let tp = parseFloat(stp.replace(/[^0-9.-]+/g, ""));
        cy.log(tp)

        totalPrices.push(tp)
      })
    })
  })
})

// Array of total prices in the new invoice page and preview page
var totalPrices = []
// --------------------------------------------------------------

Cypress.Commands.add('newInvoicePreview', () => {

  cy.get(pe.addNewInvoice_header).contains('Action').click()
  cy.get('.btn-group > .dropdown-menu').contains('Preview').click()

  // --- Get total price on preview page

  cy.get('.total > td').eq(1).then((el) => {

    let stp = el.text()

    let tp = parseFloat(stp.replace(/[^0-9.-]+/g, ""));
    cy.log(tp)

    totalPrices.push(tp)
  })

  cy.log(totalPrices)

})

Cypress.Commands.add('compareTotalPrice', () => {
  expect(totalPrices).to.have.lengthOf(2)
  expect(totalPrices[0]).to.equal(totalPrices[1])
})





Cypress.Commands.add('goto', url => {
  return new Promise(res => {
    setTimeout(() => {
      const frame = window.top.document.getElementsByClassName('aut-iframe')[0];
      frame.src = url;
      var evt = window.top.document.createEvent('Event');
      evt.initEvent('load', false, false);
      window.dispatchEvent(evt);
      res();
    }, 300);
  });
});