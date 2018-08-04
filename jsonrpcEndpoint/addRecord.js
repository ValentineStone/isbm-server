const recordTypes = require('../recordTypes')
const pickProps = require('lodash/pick')

module.exports = function addRecord(type, record = {}) {
  if (!this.user)
    throw new Error('No user session present')

  if (!recordTypes.includes(type))
    throw new Error('Unknown record type: ' + type)

  return this.db.querySingle(`
    MATCH (s:Statistics)
    SET s.numberOfType${type} = COALESCE(s.numberOfType${type}, 0) + 1
    WITH s.numberOfType${type} as indexOfType
    CREATE (record:${type})
    SET record = $record
    SET record.id = apoc.create.uuid()
    SET record.timeCreated = $timeCreated
    SET record.timeEdited = $timeCreated
    SET record.indexOfType = toString(indexOfType)
    RETURN record {.*}`,
    { timeCreated: Date.now(), record }
  ).then(v => v.record)
}