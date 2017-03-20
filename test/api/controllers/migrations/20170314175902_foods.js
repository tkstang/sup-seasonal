
exports.up = function(knex, Promise) {
  return knex.schema.createTable('foods', (table) => {
    table.increments('id');
    table.string('food_name')
      .notNullable()
      .unique()
      .defaultTo('');

    table.integer('created_by')
      .notNullable()
      .references('id')
      .inTable('users');

    table.timestamps(true, true);
    table.boolean('jan')
      .notNullable()
      .defaultTo(false);

    table.boolean('feb')
      .notNullable()
      .defaultTo(false);

    table.boolean('mar')
      .notNullable()
      .defaultTo(false);

    table.boolean('apr')
      .notNullable()
      .defaultTo(false);

    table.boolean('may')
      .notNullable()
      .defaultTo(false);

    table.boolean('jun')
      .notNullable()
      .defaultTo(false);

    table.boolean('jul')
      .notNullable()
      .defaultTo(false);

    table.boolean('aug')
      .notNullable()
      .defaultTo(false);

    table.boolean('sep')
      .notNullable()
      .defaultTo(false);

    table.boolean('oct')
      .notNullable()
      .defaultTo(false);

    table.boolean('nov')
      .notNullable()
      .defaultTo(false);

    table.boolean('dec')
      .notNullable()
      .defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('foods');
};
