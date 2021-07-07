exports.seed = function(knex) {
  return knex("User_Categories").insert([
    {
      user_id: 1,
      category_id: 1,
      weight: 0.3
    },
    {
      user_id: 1,
      category_id: 2,
      weight: 0.7
    },
    {
      user_id: 2,
      category_id: 1,
      weight: 0.9
    },
    {
      user_id: 2,
      category_id: 2,
      weight: 0.1
    }
  ]);
};
