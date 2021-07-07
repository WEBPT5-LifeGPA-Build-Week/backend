const db = require("../data/dbConfig.js");
const userHabitsModel = require("./user-habits-model.js");

describe("user-habits model", () => {
  describe("add()", () => {
    beforeEach(async () => {
      await db.seed.run();
    });

    it("should add 2 user habits", async () => {
      let userHabit = await userHabitsModel.insert({
        user_id: 1,
        category_id: 1,
        name: "habit added yo",
        daily_goal_amount: 2,
        weight: 0.6
      });
      expect(userHabit.user_id).toBe(1);
      expect(userHabit.category_id).toBe(1);
      expect(userHabit.name).toBe("habit added yo");
      expect(userHabit.daily_goal_amount).toBe("2");
      expect(userHabit.weight).toBe(0.6);
      userHabit = await userHabitsModel.insert({
        user_id: 2,
        category_id: 2,
        name: "habit 2 added yo",
        daily_goal_amount: 3,
        weight: 0.9
      });
      expect(userHabit.user_id).toBe(2);
      expect(userHabit.category_id).toBe(2);
      expect(userHabit.name).toBe("habit 2 added yo");
      expect(userHabit.daily_goal_amount).toBe("3");
      expect(userHabit.weight).toBe(0.9);

      const userHabits = await userHabitsModel.getAll();
      //because there are 10 in the seed
      expect(userHabits).toHaveLength(12);
    });
  });
  describe("getById()", () => {
    it("should return gaffer if id = 1", async () => {
      let userHabit = await userHabitsModel.getById(11);
      expect(userHabit.user_id).toBe(1);
      expect(userHabit.category_id).toBe(1);
      expect(userHabit.name).toBe("habit added yo");
      expect(userHabit.daily_goal_amount).toBe("2");
      expect(userHabit.weight).toBe(0.6);
    });

    it("should return sam if id = 2", async () => {
      let userHabit = await userHabitsModel.getById(12);
      expect(userHabit.user_id).toBe(2);
      expect(userHabit.category_id).toBe(2);
      expect(userHabit.name).toBe("habit 2 added yo");
      expect(userHabit.daily_goal_amount).toBe("3");
      expect(userHabit.weight).toBe(0.9);
    });
  });
  describe("del()", () => {
    it("should delete 1 user", async () => {
      let userHabit = await userHabitsModel.remove(11);
      expect(userHabit.user_id).toBe(1);
      expect(userHabit.category_id).toBe(1);
      expect(userHabit.name).toBe("habit added yo");
      expect(userHabit.daily_goal_amount).toBe("2");
      expect(userHabit.weight).toBe(0.6);
      let userHabits = await db("User_Habits");
      expect(userHabits).toHaveLength(11);

      userHabit = await userHabitsModel.remove(12);
      expect(userHabit.user_id).toBe(2);
      expect(userHabit.category_id).toBe(2);
      expect(userHabit.name).toBe("habit 2 added yo");
      expect(userHabit.daily_goal_amount).toBe("3");
      expect(userHabit.weight).toBe(0.9);

      userHabits = await db("User_Habits");
      expect(userHabits).toHaveLength(10);
    });
  });
});
