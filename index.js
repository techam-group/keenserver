// require('./src/config/config')
require('dotenv').config()
const { MONGODB_URI, MONGODB_URI_OFFLINE, PORT, /* SSL_PORT, */ NODE_ENV, BASE_URL } = process.env
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const cors = require('cors')
// const fs = require('fs')
// const path = require('path')
// const https = require('https')
const DB = require('./src/database')
const superAdminDetails = require('./src/config/superAdmin.config')
const allowedOrigins = ["https://keencademiks.now.sh", "https://keenclient.phavor.now.sh", "http://localhost:3000", "localhost:3000"]

const typeDefs = require('./src/types')
const resolvers = require('./src/resolvers')
const dataSources = require('./src/datasources')

const { getUser } = require('./src/utils/helpers')

const app = express()
app.use(cors(allowedOrigins))

const DB_URI = NODE_ENV ? MONGODB_URI : MONGODB_URI_OFFLINE
new DB(superAdminDetails).connect(DB_URI)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || '';

    const AuthUser = await getUser(token);

    return { AuthUser };
  },
  dataSources: () => (dataSources)
})

const BASE_SERVER = NODE_ENV ?
  `${BASE_URL}${server.graphqlPath}` :
  `http://localhost:${PORT}${server.graphqlPath}`

server.applyMiddleware({ app, cors: false, path: '/' })
app.listen(PORT, () => console.log(`🚀 Server ready at ${BASE_SERVER}`))

// https.createServer({
//   key: fs.readFileSync(path.join(process.cwd(), '/key.pem')),
//   cert: fs.readFileSync(path.join(process.cwd(), '/cert.pem'))
// })
//   .listen(SSL_PORT || 4141, () => {
//     console.log(`HTTPS server running on ${
//       NODE_ENV ?
//         'keenserver.herokuapp.com:' : 'https://localhost:'}${SSL_PORT || 4141}/`)
//   }).setTimeout(780000)
