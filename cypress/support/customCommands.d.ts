declare namespace Cypress {
    interface Chainable<Subject> {
        login(email: any, password: any): Chainable<any>
        loginFormValidation_UI(): Chainable<any>
        elementIsVisible(element: any): Chainable<any>
        navigateTo(root: any): Chainable<any>
        createNewInvoice(customerName: any, itemsCount: any, discountType: any, discount: any): Chainable<any>
        newInvoicePreview(): Chainable<any>
        goto(url: any): Chainable<any>
  }
}