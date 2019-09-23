// require('./src/config/config')
require('dotenv').config()
const { MONGODB_URI, MONGODB_URI_OFFLINE, PORT, SSL_PORT, NODE_ENV } = process.env
const { ApolloServer } = require('apollo-server')
const fs = require('fs')
const path = require('path')
const https = require('https')
const DB = require('./src/database')
const superAdminDetails = require('./src/config/superAdmin.config')

const typeDefs = require('./src/types')
const resolvers = require('./src/resolvers')
const dataSources = require('./src/datasources')

const { getUser } = require('./src/utils/helpers')

const DB_URI = NODE_ENV ? MONGODB_URI : MONGODB_URI_OFFLINE
console.log(NODE_ENV)
new DB(superAdminDetails).connect(DB_URI)

const server = new ApolloServer({
  cors: true,
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || '';

    const AuthUser = await getUser(token);

    return { AuthUser };
  },
  dataSources: () => (dataSources)
})

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})

https.createServer({
  key: fs.readFileSync(path.join(process.cwd(), '/key.pem')),
  cert: fs.readFileSync(path.join(process.cwd(), '/cert.pem'))
})
  .listen(SSL_PORT || 4141, () => {
    console.log(`HTTPS server running on https://localhost:${SSL_PORT || 4141}/`)
  }).setTimeout(780000)
