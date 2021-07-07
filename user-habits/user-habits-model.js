const db = require("../data/dbConfig.js");

module.exports = {
  getAll,
  getByUserId,
  getById,
  insert,
  update,
  remove
};

function getAll() {
  return db("User_Habits");
}

function getByUserId(user_id) {
  return db("User_Habits")
    .select(
      "id",
      "category_id",
      "name",
      "description",
      "daily_goal_amount",
      "weight"
    )
    .where("user_id", user_id);
}

function getById(id) {
  return db("User_Habits")
    .where("id", id)
    .first();
}

function insert(user_habit) {
  return db("User_Habits")
    .insert(user_habit)
    .then(([id]) => this.getById(id));
}

function update(updated_user_habit, id) {
  return db("User_Habits")
    .where("id", id)
    .update(updated_user_habit)
    .then(count => (count > 0 ? this.getById(id) : null));
}

async function remove(id) {
  const userHabit = await getById(id);
  await db("User_Habits")
    .where("id", id)
    .del();
  return userHabit;
}
