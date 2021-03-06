const recordTypes = require('../recordTypes')
const pickProps = require('lodash/pick')

module.exports = function getRecord({ id, type }) {
  if (!this.user)
    throw new Error('No user session present')

  if (!recordTypes.includes(type))
    throw new Error('Unknown record type: ' + type)

  return this.db.querySingle(
    `MATCH (record { id: $id }) RETURN record {.*}`,
    { id }
  ).then(v => v && v.record)
}