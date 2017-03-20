
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', (table) =>{
    table.increments('id');
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users');

    table.integer('recipe_id')
      .notNullable();

    table.string('month')
      .notNullable();

    table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
