const db = require("../data/dbConfig.js");
const userCategoriesModel = require("./user-categories-model.js");

describe("user-categories model", () => {
  describe("add()", () => {
    beforeEach(async () => {
      await db.seed.run();
    });

    it("should add 2 user categories", async () => {
      let userCategory = await userCategoriesModel.insert({
        user_id: 1,
        category_id: 3,
        weight: 0.6
      });
      expect(userCategory.user_id).toBe(1);
      expect(userCategory.category_id).toBe(3);
      expect(userCategory.weight).toBe(0.6);
      userCategory = await userCategoriesModel.insert({
        user_id: 2,
        category_id: 3,
        weight: 0.9
      });
      expect(userCategory.user_id).toBe(2);
      expect(userCategory.category_id).toBe(3);
      expect(userCategory.weight).toBe(0.9);

      const userCategories = await userCategoriesModel.getAll();
      //because there are 4 in the seed
      expect(userCategories).toHaveLength(6);
    });
  });
  describe("getById()", () => {
    it("should return user id 1, category 3, 0.6 weight if id = 5", async () => {
      let userCategory = await userCategoriesModel.getById(5);
      expect(userCategory.user_id).toBe(1);
      expect(userCategory.category_id).toBe(3);
      expect(userCategory.weight).toBe(0.6);
    });

    it("should return user id 2, category 3, 0.9 weight if id = 6", async () => {
      let userCategory = await userCategoriesModel.getById(6);
      expect(userCategory.user_id).toBe(2);
      expect(userCategory.category_id).toBe(3);
      expect(userCategory.weight).toBe(0.9);
    });
  });
  describe("del()", () => {
    it("should delete 1 user", async () => {
      let userCategory = await userCategoriesModel.remove(5);
      expect(userCategory.user_id).toBe(1);
      expect(userCategory.category_id).toBe(3);
      expect(userCategory.weight).toBe(0.6);
      let userCategories = await db("User_Categories");
      expect(userCategories).toHaveLength(5);

      userCategory = await userCategoriesModel.remove(6);
      expect(userCategory.user_id).toBe(2);
      expect(userCategory.category_id).toBe(3);
      expect(userCategory.weight).toBe(0.9);

      userCategories = await db("User_Categories");
      expect(userCategories).toHaveLength(4);
    });
  });
});
