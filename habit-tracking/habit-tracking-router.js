const express = require("express");
const db = require("./habit-tracking-model.js");
const restricted = require("../auth/restricted-middleware.js");

const router = express.Router();

router.get("/", restricted, async (req, res) => {
  try {
    const trackedHabits = await db.getAll();
    res.json(trackedHabits);
  } catch (err) {
    res.status(500).json({ message: "Failed to get tracked user habits" });
  }
});

router.get("/:id", restricted, validateTrackedHabitId, (req, res) => {
  res.status(200).json(req.trackedHabit);
});

router.post("/", restricted, validateTrackedHabit, async (req, res) => {
  try {
    const updatedTrackedHabit = await db.insert(req.body);
    res.status(201).json(updatedTrackedHabit);
  } catch (err) {
    res.status(500).json({ message: "Failed to add tracking of user habit" });
  }
});

router.put(
  "/:id",
  restricted,
  validateTrackedHabit,
  validateTrackedHabitId,
  async (req, res, next) => {
    try {
      const updatedTrackedHabit = await db.update(req.body, req.params.id);
      res.json(updatedTrackedHabit);
    } catch (err) {
      next({
        status: 500,
        message: "Failed to update tracked user habit"
      });
    }
  }
);

router.delete("/:id", restricted, validateTrackedHabitId, async (req, res) => {
  try {
    const deleted = await db.remove(req.trackedHabit.id);
    if (deleted) {
      res.status(200).json(req.trackedHabit);
    } else {
      next({
        status: 404,
        message: "The tracked user habit with the specified ID does not exist."
      });
    }
  } catch (err) {
    next({
      status: 500,
      message: "Failed to delete tracked user habit"
    });
  }
});

async function validateTrackedHabitId(req, res, next) {
  try {
    const { id } = req.params;
    const trackedHabit = await db.getById(id);
    if (trackedHabit) {
      req.trackedHabit = trackedHabit;
      next();
    } else {
      next({
        status: 404,
        message: "The tracked user habit with the specified ID does not exist."
      });
    }
  } catch {
    next({
      status: 500,
      message: "The tracked user habit could not be retrieved."
    });
  }
}

function validateTrackedHabit(req, res, next) {
  if (req.body && Object.keys(req.body).length > 0) {
    if (req.body.user_habit_id && req.body.done_on && req.body.quantity) {
      next();
    } else {
      next({
        status: 400,
        message: "missing user_habit_id, done_on, and/or quantity field(s)"
      });
    }
  } else {
    next({
      status: 400,
      message: "missing data for tracking user's habit"
    });
  }
}

module.exports = router;
