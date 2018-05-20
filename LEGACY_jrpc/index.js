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

    return endpoint[name](...args, env)
  }
  else
    throw new Error('Unknown call: ' + name)
}

module.exports.isJRPC =
  json => typeof json === 'object' && json && json.jsonrpc === '2.0'

