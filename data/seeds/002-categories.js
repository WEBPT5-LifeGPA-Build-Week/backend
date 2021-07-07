exports.seed = function(knex) {
  return knex("Categories").insert([
    {
      name: "Health"
    },
    {
      name: "Wealth"
    },
    {
      name: "Social"
    }
  ]);
};
