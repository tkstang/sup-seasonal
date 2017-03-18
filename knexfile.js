// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/sup_seasonal_dev'

  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/sup_seasonal_test'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
