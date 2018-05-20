const neo4j = require('neo4j-driver').v1
const db = neo4j.driver('bolt://127.0.0.1:7687', neo4j.auth.basic('neo4j', 'Neo4j170310'))

const isValidJSONRPCRequest =
  json => typeof json === 'object' && json && json.jsonrpc === '2.0'

db.run = (statement, parameters) => {
  const session = db.session()
  return session.run(statement, parameters)
    .then(v => Object.assign({}, ...v.records.map(r => r.toObject())))
    .finally(() => session.close())
}

const glob = require('glob')
const path = require('path')

const jsonrpcEndpoint = {}
glob.sync('./jsonrpcEndpoint/*.js').forEach(file => {
  jsonrpcEndpoint[path.basename(file, '.js')] = require(path.resolve(file))
})
const jsonrpApply =
  (env, method, params) => jsonrpcEndpoint[method].apply(env, params)

const identifyUser = env => {
  if (env.req.auth) {
    env.db.run(
      `MATCH (token:AccessToken { id: $id })-[:GRANTS_ACCESS]->(user:User)
      RETURN properties(user) as user`,
      { id: env.req.auth.jti }
    ).then(r => r.user)
  }
  else
    return undefined
}

module.exports = async (req, res) => {
  const env = { req, res, db }
  const request = req.body
  const response = { jsonrpc: '2.0' }
  try {
    if (!isValidJSONRPCRequest(request))
      response.error = 'Malformed JSON-RPC request'
    else if (!(request.method in jsonrpcEndpoint))
      response.error = 'Unknown JSON-RPC method: ' + request.method
    else {
      env.user = await identifyUser(env)
      response.id = request.id
      response.result = await jsonrpApply(env, request.method, request.params)
    }
  }
  catch (error) {
    response.error = error.message
  }
  res.json(response)
}
