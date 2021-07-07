const db = require("../data/dbConfig.js");
const habitTrackingModel = require("./habit-tracking-model.js");

describe("habit-tracking model", () => {
  describe("add()", () => {
    beforeEach(async () => {
      await db.seed.run();
    });

    it("should add 2 habit-tracks", async () => {
      let habitTrack = await habitTrackingModel.insert({
        user_habit_id: 5,
        done_on: new Date("February 28 2019 12:30"),
        quantity: 4
      });
      expect(habitTrack.user_habit_id).toBe(5);
      expect(habitTrack.done_on).toBe(new Date("February 28 2019 12:30") - 0);
      expect(habitTrack.quantity).toBe(4);
      habitTrack = await habitTrackingModel.insert({
        user_habit_id: 6,
        done_on: new Date("February 27 2019 12:30"),
        quantity: 9
      });
      expect(habitTrack.user_habit_id).toBe(6);
      expect(habitTrack.done_on).toBe(new Date("February 27 2019 12:30") - 0);
      expect(habitTrack.quantity).toBe(9);

      const habitTracks = await habitTrackingModel.getAll();
      //because there are 13 in the seed
      expect(habitTracks).toHaveLength(15);
    });
  });
  describe("getById()", () => {
    it("should return user_habit_id=5, done_on = February 28 2019 12:30, quantity = 4, if id = 14", async () => {
      let habitTrack = await habitTrackingModel.getById(14);
      expect(habitTrack.user_habit_id).toBe(5);
      expect(habitTrack.done_on).toBe(new Date("February 28 2019 12:30") - 0);
      expect(habitTrack.quantity).toBe(4);
    });

    it("should return user_habit_id=6, done_on = February 27 2019 12:30, quantity = 9, if id = 15", async () => {
      let habitTrack = await habitTrackingModel.getById(15);
      expect(habitTrack.user_habit_id).toBe(6);
      expect(habitTrack.done_on).toBe(new Date("February 27 2019 12:30") - 0);
      expect(habitTrack.quantity).toBe(9);
    });
  });
  describe("del()", () => {
    it("should delete 1 user", async () => {
      let habitTrack = await habitTrackingModel.remove(14);
      expect(habitTrack.user_habit_id).toBe(5);
      expect(habitTrack.done_on).toBe(new Date("February 28 2019 12:30") - 0);
      expect(habitTrack.quantity).toBe(4);
      let habitTracks = await db("Habit_Tracking");
      expect(habitTracks).toHaveLength(14);

      habitTrack = await habitTrackingModel.remove(15);
      expect(habitTrack.user_habit_id).toBe(6);
      expect(habitTrack.done_on).toBe(new Date("February 27 2019 12:30") - 0);
      expect(habitTrack.quantity).toBe(9);

      habitTracks = await db("Habit_Tracking");
      expect(habitTracks).toHaveLength(13);
    });
  });
});
