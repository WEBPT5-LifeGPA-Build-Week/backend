const express = require("express");
const db = require("./user-habits-model.js");
const restricted = require("../auth/restricted-middleware.js");

const router = express.Router();

router.get("/", restricted, async (req, res) => {
  try {
    const habits = await db.getAll();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user habits" });
  }
});

router.get("/:id", restricted, validateUserHabitId, (req, res) => {
  res.status(200).json(req.userHabit);
});

router.post("/", restricted, validateUserHabit, async (req, res) => {
  try {
    const updatedUserHabit = await db.insert(req.body);
    res.status(201).json(updatedUserHabit);
  } catch (err) {
    res.status(500).json({ message: "Failed to add new user habit" });
  }
});

router.put(
  "/:id",
  restricted,
  validateUserHabit,
  validateUserHabitId,
  async (req, res, next) => {
    try {
      const updatedUserHabit = await db.update(req.body, req.params.id);
      res.json(updatedUserHabit);
    } catch (err) {
      next({
        status: 500,
        message: "Failed to update user habit"
      });
    }
  }
);

router.delete("/:id", restricted, validateUserHabitId, async (req, res) => {
  try {
    const deleted = await db.remove(req.userHabit.id);
    if (deleted) {
      res.status(200).json(req.userHabit);
    } else {
      next({
        status: 404,
        message: "The user habit with the specified ID does not exist."
      });
    }
  } catch (err) {
    next({
      status: 500,
      message: "Failed to delete user habit"
    });
  }
});

async function validateUserHabitId(req, res, next) {
  try {
    const { id } = req.params;
    const userHabit = await db.getById(id);
    if (userHabit) {
      req.userHabit = userHabit;
      next();
    } else {
      next({
        status: 404,
        message: "The user habit with the specified ID does not exist."
      });
    }
  } catch {
    next({
      status: 500,
      message: "The user habit could not be retrieved."
    });
  }
}

function validateUserHabit(req, res, next) {
  if (req.body && Object.keys(req.body).length > 0) {
    if (
      req.body.category_id &&
      req.body.weight &&
      req.body.name &&
      req.body.daily_goal_amount
    ) {
      req.body.user_id = req.session.user.id;
      next();
    } else {
      next({
        status: 400,
        message:
          "missing category_id, name, daily_goal_amount, and/or weight field(s)"
      });
    }
  } else {
    next({
      status: 400,
      message: "missing user habit data"
    });
  }
}

module.exports = router;
