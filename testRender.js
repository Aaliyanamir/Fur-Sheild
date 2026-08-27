require('url'); // dummy
const React = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router-dom/server');
const fs = require('fs');

// We need to transpile JSX to run it in Node. We can use babel or esbuild.
// Actually, it's easier to just build the frontend and check the browser console using puppeteer if we had it, but we can just use esbuild to run the component.
