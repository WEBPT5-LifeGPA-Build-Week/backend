const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  del
};

function find() {
  return db("Users").select("id", "username", "email");
}

// the destructured object here has given me issues in the past
// make sure this works!
function findBy(username) {
  return db("Users").where({ username: username });
}

async function add(user) {
  try {
    const [id] = await db("Users").insert(user);

    return findById(id);
  } catch (err) {
    console.log(err);
  }
}

function findById(id) {
  return db("Users")
    .where({ id })
    .first();
}

async function del(id) {
  const user = await findById(id);
  await db("users")
    .where("id", "=", id)
    .del();
  return user;
}
