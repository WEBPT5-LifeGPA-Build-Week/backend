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
  return db("Habit_Tracking");
}

function getByUserId(user_id) {
  return db("Habit_Tracking as ht")
    .join("User_Habits as uh", "uh.id", "ht.user_habit_id")
    .select(
      "ht.id",
      "ht.user_habit_id",
      "uh.name",
      "uh.description",
      "uh.daily_goal_amount",
      "ht.done_on",
      "ht.quantity"
    )
    .where("uh.user_id", user_id);
}

function getById(id) {
  return db("Habit_Tracking")
    .where("id", id)
    .first();
}

function insert(habit_done) {
  return db("Habit_Tracking")
    .insert(habit_done)
    .then(([id]) => this.getById(id));
}

function update(updated_habit_done, id) {
  return db("Habit_Tracking")
    .where("id", id)
    .update(updated_habit_done)
    .then(count => (count > 0 ? this.getById(id) : null));
}

async function remove(id) {
  const habitTracked = await getById(id);
  await db("Habit_Tracking")
    .where("id", id)
    .del();
  return habitTracked;
}
