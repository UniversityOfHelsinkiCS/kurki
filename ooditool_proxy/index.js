const proxy = require('express-http-proxy');
const app = require('express')();

//const PROXY_ADDR = 'svn-23.cs.helsinki.fi'
const PROXY_ADDR = 'opetushallinto.cs.helsinki.fi'

app.get('/', (req, res) => {
  console.log("works")

  res.send({ status: "works" })
})

app.use('/froyo/', proxy(PROXY_ADDR, {
  proxyReqPathResolver: function (req) {
    console.log(req.url)
    const parts = req.url.split('?')
    const queryString = parts[1]
    const updatedPath = parts[0].replace('froyo', '')
    return updatedPath + (queryString ? '?' + queryString : '')
  }
}))

app.listen(3000, () => console.log(`Proxy running in port 3000, proxying to ${PROXY_ADDR}`))