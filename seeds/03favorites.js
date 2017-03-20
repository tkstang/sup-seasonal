
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('favorites').del()
    .then(() =>{
      return knex('favorites').insert([
        {
          user_id: 1,
          recipe_id: 12345,
          month: 'jan'
        },
        {
          user_id: 2,
          recipe_id: 54321,
          month: 'feb'
        },
        {
          user_id: 1,
          recipe_id: 66666,
          month: 'apr'
        }
      ])
        .then(() =>{
          return knex.raw("SELECT setval('favorites_id_seq', (SELECT MAX(id) FROM favorites));");
        });
    });
};
