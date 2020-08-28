const proxy = require('express-http-proxy');
const app = require('express')();

const PROXY_ADDR = 'kurki:8080'
let uid = 'mluukkai'

app.get('/uid/:uid', (req, res) => {
  const params = req.params
  uid = params.uid

  res.send({ uid })
})

app.use('/', proxy(PROXY_ADDR, {
  proxyReqOptDecorator: function(proxyReqOpts) {
    proxyReqOpts.headers = {
      ...proxyReqOpts.headers,
      uid,
    }
    return proxyReqOpts
  }
}));

app.listen(3000, () => console.log(`Proxy running in port 3000, proxying to ${PROXY_ADDR}`))