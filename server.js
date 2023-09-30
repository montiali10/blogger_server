const app = require('./src/app.js')
const port = process.env.SERVER_PORT || 5000
app.listen(port)