const neo4j = require('neo4j-driver').v1
const db = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'Neo4j170310'))

const calc = require('./calc.js')
const cypher = require('./cypher.js')

const endpoint = {
  calc,
  cypher
}

endpoint.echoAuth = env => env.req.auth || 'No auth data present'
endpoint.getPlaceholderJWT = () => [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  'eyJqdGkiOiJwaW5raWVwaWUifQ',
  'amzMkJr5uFJCRsI7FcaII0N4XV_iAceDPLF2OwOFx-U'
].join('.')

module.exports = (name, args, env) => {
  if (name in endpoint)
    return endpoint[name](...args, env)
  else
    throw new Error('Unknown call: ' + name)
}

module.exports.isJRPC = req => Array.isArray(req.body) && req.body.length > 0

