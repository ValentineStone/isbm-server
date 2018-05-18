const neo4j = require('neo4j-driver').v1
const db = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'Neo4j170310'))

const jsonwebtoken = require('jsonwebtoken')

const jwtFromAccessToken = token => jsonwebtoken.sign({ jti: token }, 'pinkiepie')
const accessTokenFromJwt = jwt => jsonwebtoken.verify(jwt, 'pinkiepie').jti

const calc = require('./calc.js')
const cypher = require('./cypher.js')
const sendMail = require('./endpoint/sendMail.js')

const endpoint = {
  calc,
  cypher,
  sendMail
}

endpoint.echoAuth = env => env.req.auth || 'No auth data present'

endpoint.getPlaceholderJWT = () => [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  'eyJqdGkiOiJwaW5raWVwaWUifQ',
  'amzMkJr5uFJCRsI7FcaII0N4XV_iAceDPLF2OwOFx-U'
].join('.')

endpoint.authenticateUser = async (userCredentials, env) => {
  let user, token
  if (!userCredentials.jwt) {
    ({ user, token } = await cypher(
      `MATCH (user:User {
        username: $credentials.username,
        password: $credentials.password
      })
      CREATE (token:AccessToken {id:apoc.create.uuid()})-[:GRANTS_ACCESS]->(user)
      RETURN properties(user) as user, token.id as token`,
      { credentials: userCredentials },
      env
    ))
  }
  else {
    token = accessTokenFromJwt(userCredentials.jwt);
    ({ user } = await cypher(
      `MATCH (token:AccessToken { id: $id })-[:GRANTS_ACCESS]->(user:User)
      RETURN properties(user) as user`,
      { id: token },
      env
    ))
  }

  if (!user)
    return { error: 'No such user exists' }

  return {
    username: user.username,
    alias: user.alias,
    preferences: user.preferences,
    jwt: userCredentials.jwt || jwtFromAccessToken(token)
  }
}


endpoint.logOutUser = async env => {
  if (!env.user)
    return { error: 'No user session present' }

  await cypher(
    `MATCH (token:AccessToken { id: $id }) DETACH DELETE token`,
    { id: env.req.auth.jti },
    env
  )

  return 'success'
}

module.exports = async (name, args, env) => {
  env.db = db
  if (name in endpoint) {
    if (env.req.auth) {
      const user = await cypher(
        `MATCH (token:AccessToken { id: $id })-[:GRANTS_ACCESS]->(user:User)
        RETURN properties(user) as user`,
        { id: env.req.auth.jti },
        env
      )
      if (user)
        env.user = user
    }
    console.log('env.user', env.user)

    return endpoint[name](...args, env)
  }
  else
    throw new Error('Unknown call: ' + name)
}

module.exports.isJRPC = req => Array.isArray(req.body) && req.body.length > 0

