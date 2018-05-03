const neo4j = require('neo4j-driver').v1
const db = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'Neo4j170310'))

const jrpc = require('./jrpc')

module.exports = async (req, res) => {
  const env = { req, res, db }
  let response
  try {
    if (jrpc.isJRPC(req)) {
      const name = req.body[0]
      const args = req.body.slice(1)
      response = await jrpc(name, args, env)
    }
    else
      response = { error: 'Unknown request structure' }
  }
  catch (error) {
    response = { error: error.message }
  }
  res.json(response)
}
