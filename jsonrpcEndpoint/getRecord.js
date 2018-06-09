const recordTypes = require('../recordTypes')
const pickProps = require('lodash/pick')

module.exports = function getClients({ id, type, props }) {
  if (!this.user)
    throw new Error('No user session present')

  if (!recordTypes.includes(type))
    throw new Error('Unknown record type: ' + type)

  return this.db.querySingle(
    `MATCH (record:${type} { id: $id }) RETURN record {.*}`,
    { id }
  ).then(v => props ? pickProps(v.record, props) : v.record)
}