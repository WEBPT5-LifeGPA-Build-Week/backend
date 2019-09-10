const express = require("express");
const db = require("./user-categories-model.js");
const restricted = require("../auth/restricted-middleware.js");

const router = express.Router();

// need to add middleware that verifies and includes the user (with user_id).
// this is necessary for auth validation but also for adding the user_id to objects being added

router.get("/", restricted, async (req, res) => {
  try {
    const categories = await db.getAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user categories" });
  }
});

router.get("/:id", restricted, validateUserCategoryId, (req, res) => {
  res.status(200).json(req.userCategory);
});

router.post("/", restricted, validateUserCategory, async (req, res) => {
  try {
    const updatedUserCategory = await db.insert(req.userCategory);
    res.status(201).json(updatedUserCategory);
  } catch (err) {
    res.status(500).json({ message: "Failed to add new user category" });
  }
});

router.put(
  "/:id",
  restricted,
  validateUserCategory,
  validateUserCategoryId,
  async (req, res) => {
    try {
      const updatedUserCategory = await db.update(req.userCategory, id);
      res.json(updatedUserCategory);
    } catch (err) {
      next({
        status: 500,
        message: "Failed to update user category"
      });
    }
  }
);

router.delete("/:id", restricted, validateUserCategoryId, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await db.remove(id);

    if (deleted) {
      res.status(200).json(req.userCategory);
    } else {
      next({
        status: 404,
        message: "The user category with the specified ID does not exist."
      });
    }
  } catch (err) {
    next({
      status: 500,
      message: "Failed to delete user category"
    });
  }
});

async function validateUserCategoryId(req, res, next) {
  try {
    const { id } = req.params;
    const userCategory = await db.getById(id);
    if (userCategory) {
      req.userCategory = userCategory;
      next();
    } else {
      next({
        status: 404,
        message: "The user category with the specified ID does not exist."
      });
    }
  } catch {
    next({
      status: 500,
      message: "The user category could not be retrieved."
    });
  }
}

function validateUserCategory(req, res, next) {
  if (req.body && Object.keys(req.body).length > 0) {
    if (req.body.category_id && req.body.weight) {
      req.body.user_id = req.session.user.id;
      next();
    } else {
      next({
        status: 400,
        message: "missing category_id and/or weight field(s)"
      });
    }
  } else {
    next({
      status: 400,
      message: "missing user category data"
    });
  }
}

module.exports = router;
