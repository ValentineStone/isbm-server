const recordTypes = require('../recordTypes')
const pickProps = require('lodash/pick')

module.exports = function setRecord(type) {
  if (!this.user)
    throw new Error('No user session present')

  if (!recordTypes.includes(type))
    throw new Error('Unknown record type: ' + type)

  return this.db.querySingle(
    `CREATE (record:${type} {
        id: apoc.create.uuid(),
        timeCreated: $timeCreated,
        timeEdited: $timeCreated
    }) RETURN record {.*}`,
    {timeCreated: Date.now()}
  ).then(v => v.record)
}