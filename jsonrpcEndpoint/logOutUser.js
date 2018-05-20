module.exports = async function logOutUser(userCredentials) {
  if (!this.user)
    throw new Error('No user session present')

  await this.db.run(
    `MATCH (token:AccessToken { id: $id }) DETACH DELETE token`,
    { id: env.req.auth.jti },
    env
  )

  return 'success'
}