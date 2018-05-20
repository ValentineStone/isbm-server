module.exports = (statement, parameters, env) => {
  const session = env.db.session()
  return session.run(statement, parameters)
    .then(v => Object.assign({}, ...v.records.map(r => r.toObject())))
    .finally(() => session.close())
}