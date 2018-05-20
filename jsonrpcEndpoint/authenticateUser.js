const jsonwebtoken = require('jsonwebtoken')

const jwtFromAccessToken = token => jsonwebtoken.sign({ jti: token }, 'pinkiepie')
const accessTokenFromJwt = jwt => jsonwebtoken.verify(jwt, 'pinkiepie').jti

module.exports = async function authenticateUser(userCredentials) {
  let user, token
  if (!userCredentials.jwt) {
    ({ user, token } = await this.db.run(
      `MATCH (user:User {
          username: $credentials.username,
          password: $credentials.password
        })
        CREATE (token:AccessToken {id:apoc.create.uuid()})-[:GRANTS_ACCESS]->(user)
        RETURN properties(user) as user, token.id as token`,
      { credentials: userCredentials }
    ))
  }
  else {
    token = accessTokenFromJwt(userCredentials.jwt);
    ({ user } = await this.db.run(
      `MATCH (token:AccessToken { id: $id })-[:GRANTS_ACCESS]->(user:User)
        RETURN properties(user) as user`,
      { id: token }
    ))
  }

  if (!user)
    throw new Error('No such user exists')

  return {
    username: user.username,
    alias: user.alias,
    preferences: user.preferences,
    jwt: userCredentials.jwt || jwtFromAccessToken(token)
  }
}