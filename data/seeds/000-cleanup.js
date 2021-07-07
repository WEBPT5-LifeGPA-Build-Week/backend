exports.seed = async function(knex) {
  try {
    await knex.truncate("Habit_Tracking");
    await knex.truncate("User_Habits");
    await knex.truncate("User_Categories");
    await knex.truncate("Users");
    await knex.truncate("Categories");
  } catch (err) {
    console.log(err);
  }
};
