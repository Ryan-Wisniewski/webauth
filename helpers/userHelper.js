const knex = require('knex')
const knexConfig = require('../knexfile')
const db = knex(knexConfig.development)

module.exports = {
    get,
    getBy,
    insert,
    getById
}

function get() {
    return db('users');
}

function getBy(filter) {
    return db('users').where(filter);
  }

  function insert(user) {
    return db('users')
      .insert(user, 'id')
      .then(ids => {
        const [id] = ids;
        return getById(id);
      });
  }

function getById(id) {
    return db('users')
      .where({ id })
      .first()
}