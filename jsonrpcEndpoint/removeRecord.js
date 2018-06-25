const recordTypes = require('../recordTypes')
const pickProps = require('lodash/pick')

module.exports = function removeRecord(record) {
  if (!this.user)
    throw new Error('No user session present')

  return this.db.querySingle(
    `MATCH (record { id: $id }) DETACH DELETE record`,
    { id: record.id }
  )
}