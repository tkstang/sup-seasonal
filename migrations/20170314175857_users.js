
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();

    table.string('username')
      .notNullable()
      .defaultTo('');

    table.string('email')
      .notNullable()
      .unique();

    table.string('permissions')
      .notNullable()
      .defaultTo('user');

    table.specificType('hashed_password', 'char(60)')
      .notNullable();

    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
