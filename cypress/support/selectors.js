/// <reference types="cypress" />

export class PageElements {


    //------- Login Form

    loginForm = '.m-t'
    loginForm_title = 'h3'
    email_input = '#mat-input-0'
    password_input = '#mat-input-1'
    submitLogin_btn = '.mat-focus-indicator'

    forgotPass_btn = '.pull-left'

    //------- Header Menu

    header_menu = '.navbar-nav'


    //------- Invoices Page

    addNewInvoice_btn = '.m-r-sm'
    customerSearch_input = '.customersearchinput'
    customerList = ':nth-child(1) > .ibox > .ibox-content > .customerlist > .list-group'
    serviceLocationlist = ':nth-child(2) > .ibox > .ibox-content > .customerlist'
    proceed_btn = '.m-t-lg > .btn-primary'

        // NEW Invoice config

        //--- header options
        addNewInvoice_header = '.topheader'

        itemProps = '.editable > td'
        items_list = '.newcardsearchresult'


}