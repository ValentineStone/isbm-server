const recordTypes = require('../recordTypes')
const pickProps = require('lodash/pick')

module.exports = function getRecords({ limit, skip, type }) {
  if (!this.user)
    throw new Error('No user session present')

  if (!recordTypes.includes(type))
    throw new Error('Unknown record type: ' + type)

  return this.db.query(
    `MATCH (record:${type})
    RETURN record {.*}
    ORDER BY record.timeEdited DESC
    SKIP $skip
    LIMIT $limit`,
    { limit, skip }
  ).then(v => v.map(r =>  r.record))
}