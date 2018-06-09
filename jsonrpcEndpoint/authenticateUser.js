const jsonwebtoken = require('jsonwebtoken')

const jwtFromAccessToken = token => jsonwebtoken.sign({ jti: token }, 'pinkiepie')
const accessTokenFromJwt = jwt => jsonwebtoken.verify(jwt, 'pinkiepie').jti

module.exports = async function authenticateUser(userCredentials) {
  let user, token
  if (!userCredentials.jwt) {
    const record = await this.db.querySingle(
      `MATCH (user:User {
          username: $credentials.username,
          password: $credentials.password
        })
        CREATE (token:AccessToken {id:apoc.create.uuid()})-[:GRANTS_ACCESS]->(user)
        RETURN properties(user) as user, token.id as token`,
      { credentials: userCredentials }
    )
    user = record.user
    token = record.token
  }
  else {
    token = accessTokenFromJwt(userCredentials.jwt)
    const record = await this.db.querySingle(
      `MATCH (token:AccessToken { id: $id })-[:GRANTS_ACCESS]->(user:User)
        RETURN properties(user) as user`,
      { id: token }
    )
    user = record && record.user
  }

  if (!user)
    throw new Error('No such user / session present')

  return {
    username: user.username,
    alias: user.alias,
    preferences: user.preferences,
    jwt: userCredentials.jwt || jwtFromAccessToken(token)
  }
}