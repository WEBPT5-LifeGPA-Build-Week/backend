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
  return db("User_Categories");
}

function getByUserId(user_id) {
  return db("User_Categories")
    .select("id", "category_id", "weight")
    .where("user_id", user_id);
}

function getById(id) {
  return db("User_Categories")
    .where("id", id)
    .first();
}

function insert(user_category) {
  return db("User_Categories")
    .insert(user_category)
    .then(([id]) => this.getById(id));
}

function update(updated_user_category, id) {
  return db("User_Categories")
    .where("id", id)
    .update(updated_user_category)
    .then(count => (count > 0 ? this.getById(id) : null));
}

async function remove(id) {
  const userCategory = await getById(id);
  await db("User_Categories")
    .where("id", id)
    .del();
  return userCategory;
}
