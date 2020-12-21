const proxy = require('express-http-proxy');
const app = require('express')();

const PROXY_ADDR = 'svn-23.cs.helsinki.fi'
let uid = process.env.UID

app.get('/', (req, res) => {
  console.log("works")

  res.send({ status: "works" })
})

/*
app.use('/', proxy(PROXY_ADDR, {
  proxyReqOptDecorator: function(proxyReqOpts) {
    proxyReqOpts.headers = {
      ...proxyReqOpts.headers,
      uid,
    }
    return proxyReqOpts
  }
}));
*/

app.listen(3000, () => console.log(`Proxy running in port 3000, proxying to ${PROXY_ADDR}`))