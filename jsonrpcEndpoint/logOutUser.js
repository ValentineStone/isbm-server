module.exports = async function logOutUser(userCredentials) {
  if (!this.user)
    throw new Error('No user session present')

  await this.db.querySingle(
    `MATCH (token:AccessToken { id: $id }) DETACH DELETE token`,
    { id: this.req.auth.jti }
  )

  return 'success'
}