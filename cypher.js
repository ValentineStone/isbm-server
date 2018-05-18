module.exports = (db, statement, parameters) => {
  const session = db.session()
  return session.run(statement, parameters)
    .then(v => Object.assign({}, ...v.records.map(r => r.toObject())))
    .finally(() => session.close())
}