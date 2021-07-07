exports.seed = function(knex) {
  return knex("User_Habits").insert([
    {
      user_id: 1,
      category_id: 1,
      name: "eat broccoli",
      daily_goal_amount: "100 g",
      weight: 0.25
    },
    {
      user_id: 1,
      category_id: 1,
      name: "eat carrots",
      daily_goal_amount: "75 g",
      weight: 0.25
    },
    {
      user_id: 1,
      category_id: 1,
      name: "walk",
      daily_goal_amount: "1 mile",
      weight: 0.5
    },
    {
      user_id: 1,
      category_id: 2,
      name: "make my own coffee in the morning",
      daily_goal_amount: "1 cup",
      weight: 0.4
    },
    {
      user_id: 1,
      category_id: 2,
      name: "bring my own lunch",
      daily_goal_amount: "once per day",
      weight: 0.6
    },
    {
      user_id: 2,
      category_id: 1,
      name: "do pushups",
      daily_goal_amount: "10",
      weight: 0.25
    },
    {
      user_id: 2,
      category_id: 1,
      name: "do situps",
      daily_goal_amount: "25",
      weight: 0.25
    },
    {
      user_id: 2,
      category_id: 1,
      name: "walk",
      daily_goal_amount: "2 miles",
      weight: 0.5
    },
    {
      user_id: 2,
      category_id: 2,
      name: "record expenses in budget",
      daily_goal_amount: "daily",
      weight: 0.2
    },
    {
      user_id: 2,
      category_id: 2,
      name: "work on business ideas",
      daily_goal_amount: "30 minutes",
      weight: 0.8
    }
  ]);
};
