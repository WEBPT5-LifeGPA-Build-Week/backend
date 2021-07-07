exports.up = function(knex) {
  return knex.schema
    .createTable("Users", tbl => {
      tbl.increments();
      tbl
        .text("username")
        .unique()
        .notNullable();
      tbl.text("password").notNullable();
      tbl.text("email");
    })

    .createTable("Categories", tbl => {
      tbl.increments();
      tbl
        .text("name")
        .unique()
        .notNullable();
    })

    .createTable("User_Categories", tbl => {
      tbl.increments();
      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("Users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl
        .integer("category_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("Categories")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.double("weight");
    })

    .createTable("User_Habits", tbl => {
      tbl.increments();
      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("Users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl
        .integer("category_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("Categories")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.text("name").notNullable();
      tbl.text("description");
      tbl.text("daily_goal_amount").notNullable();
      tbl.double("weight").notNullable();
    })

    .createTable("Habit_Tracking", tbl => {
      tbl.increments();
      tbl
        .integer("user_habit_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("User_Habits")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.timestamp("done_on").notNullable();
      tbl.double("quantity").notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("Habit_Tracking")
    .dropTableIfExists("User_Habits")
    .dropTableIfExists("User_Categories")
    .dropTableIfExists("Categories")
    .dropTableIfExists("Users");
};
