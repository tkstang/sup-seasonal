exports.seed = function(knex, Promise) {
  //DELETES EXISTING ENTRIES
  return knex('users').del()
    .then(() => {
      return knex('users').insert([
        {
					id: 1,
					username:	'alex',
					email:	'alexanderkrawiec@gmail.com',
					permissions: 'super_user',
					hashed_password:	'blah',
					created_at:	'2017-03-18 18:22:58.526251-07',
					updated_at:	'2017-03-18 18:22:58.526251-07'
      	},
      	{
					id: 2,
					username:	'tom',
					email:	'stang.tk@gmail.com',
					permissions: 'super_user',
					hashed_password:	'blah',
					created_at:	'2017-03-18 18:22:58.526251-07',
					updated_at:	'2017-03-18 18:22:58.526251-07'
	      },
      	{
					id: 3,
					username:	'don',
					email:	'daredevildon@gmail.com',
					permissions: 'user',
					hashed_password:	'blah',
					created_at:	'2017-03-18 18:22:58.526251-07',
					updated_at:	'2017-03-18 18:22:58.526251-07'		
	      }])
      .then(() => {
        return knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));");
      });
    });
};
