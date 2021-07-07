const router = require("express").Router();

const userCategoriesDb = require("../user-categories/user-categories-model.js");
const userHabitsDb = require("../user-habits/user-habits-model.js");
const habitTrackingDb = require("../habit-tracking/habit-tracking-model.js");
const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");
const authRouter = require("../auth/auth-router.js");

// - 'GET api/users/': test authentication route for errors
router.get("/", restricted, async (req, res) => {
  const users = await Users.find();
  if (users) {
    res.status(200).json(users);
  } else {
    next({
      status: 500,
      message: "The user list could not be retrieved."
    });
  }
});

router.use("/", authRouter);

// - `GET /api/users/:id/categories`: all categories (with weights) that a user has created
router.get("/:id/categories", restricted, validateUserId, async (req, res) => {
  const categoryList = await userCategoriesDb.getByUserId(req.user.id);
  if (categoryList) {
    res.status(200).json(categoryList);
  } else {
    next({
      status: 500,
      message: "The category list could not be retrieved."
    });
  }
});

// - `GET /api/users/:id/habits`: all habits (with weights, daily goal amounts, and category id's) that a user has created
router.get("/:id/habits", restricted, validateUserId, async (req, res) => {
  const habitList = await userHabitsDb.getByUserId(req.user.id);
  if (habitList) {
    res.status(200).json(habitList);
  } else {
    next({
      status: 500,
      message: "The habit list could not be retrieved."
    });
  }
});

// - `GET /api/users/:id/tracked_habits`: all tracking of habits (with dates done on, and amounts done) that a user has entered
router.get(
  "/:id/tracked_habits",
  restricted,
  validateUserId,
  async (req, res) => {
    const trackedHabitsList = await habitTrackingDb.getByUserId(req.user.id);
    if (trackedHabitsList) {
      res.status(200).json(trackedHabitsList);
    } else {
      next({
        status: 500,
        message: "The habit tracking list could not be retrieved."
      });
    }
  }
);

async function validateUserId(req, res, next) {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      next({ status: 404, message: "User ID not found" });
    }
  } catch {
    next({ status: 500, message: "Error accessing User ID" });
  }
}

module.exports = router;
