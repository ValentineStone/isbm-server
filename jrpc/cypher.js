module.exports = (statement, parameters) => {
  return session.run(statement, parameters)
    .then(v => Object.assign({}, ...v.records.map(r => r.toObject())))
}