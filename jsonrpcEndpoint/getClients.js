module.exports = function getClients({ limit, skip }) {
  if (!this.user)
    throw new Error('No user session present')

  return this.db.query(
    `MATCH (client:Client)
    RETURN client {id: toString(id(client)), .fullname, .desc}
    SKIP $skip
    LIMIT $limit`,
    { limit, skip }
  ).then(v => v.map(r => r.client))
}