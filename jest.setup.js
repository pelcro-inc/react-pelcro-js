/* eslint-disable import/no-unused-modules */
const fetch = require('node-fetch');

// Polyfill fetch for Jest environment
global.fetch = fetch;
global.Headers = fetch.Headers;
global.Request = fetch.Request;
global.Response = fetch.Response;
