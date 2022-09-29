const { defineConfig } = require("cypress");

module.exports = defineConfig({

  

  e2e: {
    baseUrl: 'https://onetrackui.azurewebsites.net/',
    env:{
      username: "jorji@ehtest.com",
      password: "admin",
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    chromeWebSecurity: false,
    hideXHR: true,
    numTestsKeptInMemory: 5,
    defaultCommandTimeout: 10000,

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
