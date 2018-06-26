const recordTypes = require('../recordTypes')
const pickProps = require('lodash/pick')

module.exports = function addRecord(type, record = {}) {
  if (!this.user)
    throw new Error('No user session present')

  if (!recordTypes.includes(type))
    throw new Error('Unknown record type: ' + type)

  return this.db.querySingle(`
    CREATE (record:${type})
    SET record = $record
    SET record.id = apoc.create.uuid()
    SET record.timeCreated = $timeCreated
    SET record.timeEdited = $timeCreated
    RETURN record {.*}`,
    { timeCreated: Date.now(), record }
  ).then(v => v.record)
}