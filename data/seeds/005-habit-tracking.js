exports.seed = function(knex) {
  return knex("Habit_Tracking").insert([
    {
      user_habit_id: 1,
      done_on: new Date("January 31 2019 12:30"),
      quantity: 1
    },
    {
      user_habit_id: 1,
      done_on: new Date("February 2 2019 12:30"),
      quantity: 2
    },
    {
      user_habit_id: 2,
      done_on: new Date("January 31 2019 13:30"),
      quantity: 2
    },
    {
      user_habit_id: 3,
      done_on: new Date("January 31 2019 16:30"),
      quantity: 1
    },
    {
      user_habit_id: 4,
      done_on: new Date("January 31 2019 9:30"),
      quantity: 2
    },
    {
      user_habit_id: 4,
      done_on: new Date("February 2 2019 8:30"),
      quantity: 2
    },
    {
      user_habit_id: 5,
      done_on: new Date("January 31 2019 12:00"),
      quantity: 1
    },
    {
      user_habit_id: 5,
      done_on: new Date("January 31 2019 12:00"),
      quantity: 1
    },
    {
      user_habit_id: 6,
      done_on: new Date("January 31 2019 16:00"),
      quantity: 1.5
    },
    {
      user_habit_id: 7,
      done_on: new Date("January 31 2019 16:15"),
      quantity: 1
    },
    {
      user_habit_id: 8,
      done_on: new Date("January 31 2019 18:15"),
      quantity: 2
    },
    {
      user_habit_id: 9,
      done_on: new Date("January 31 2019 14:15"),
      quantity: 1
    },
    {
      user_habit_id: 10,
      done_on: new Date("January 31 2019 19:30"),
      quantity: 1.5
    }
  ]);
};
