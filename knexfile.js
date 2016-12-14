// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: 'schedule.db'
    },
    migrations: {
      tableName: 'migrations'
    }
  }


};
