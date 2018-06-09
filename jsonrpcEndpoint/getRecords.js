const recordTypes = require('../recordTypes')
const pickProps = require('lodash/pick')

module.exports = function getClients({ limit, skip, type, props }) {
  if (!this.user)
    throw new Error('No user session present')

  if (!recordTypes.includes(type))
    throw new Error('Unknown record type: ' + type)

  return this.db.query(
    `MATCH (record:${type})
    RETURN record {.*}
    SKIP $skip
    LIMIT $limit`,
    { limit, skip }
  ).then(v => v.map(r => props ? pickProps(r.record, props) : r.record))
}