const proxy = require('express-http-proxy');
const app = require('express')();

const PROXY_ADDR = 'kurki:8080'
const NEW_HEADERS = {
  uid: 'mluukkai'
}

app.use('/', proxy(PROXY_ADDR, {
  proxyReqOptDecorator: function(proxyReqOpts) {
    proxyReqOpts.headers = {
      ...proxyReqOpts.headers,
      ...NEW_HEADERS
    }
    return proxyReqOpts
  }
}));

app.listen(3000, () => console.log(`Proxy running in port 3000, proxying to ${PROXY_ADDR}`))