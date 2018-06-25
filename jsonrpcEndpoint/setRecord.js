const recordTypes = require('../recordTypes')
const pickProps = require('lodash/pick')

module.exports = function setRecord(record) {
  if (!this.user)
    throw new Error('No user session present')

  return this.db.querySingle(
    `MATCH (record { id: $id })
    SET record = $record
    RETURN record {.*}`,
    {
      id: record.id,
      record: {
        ...record,
        timeEdited: Date.now()
      }
    }
  ).then(v => v.record)
}