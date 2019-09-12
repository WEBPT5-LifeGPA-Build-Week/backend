const request = require("supertest");
const server = require("./server.js");
const db = require("../data/dbConfig.js");
// this class below is used as a workaround to an asyn/await scope problem during the login process
class ContextHelper {}

const testUser = {
  username: "test1",
  password: "pass1"
};

const expectedCategories = [
  { category_id: 1, id: 1, weight: 0.3 },
  { category_id: 2, id: 2, weight: 0.7 }
];

const expectedTrackedHabits = [
  {
    daily_goal_amount: "100 g",
    description: null,
    done_on: 1548966600000,
    id: 1,
    name: "eat broccoli",
    quantity: 1,
    user_habit_id: 1
  },
  {
    daily_goal_amount: "100 g",
    description: null,
    done_on: 1549139400000,
    id: 2,
    name: "eat broccoli",
    quantity: 2,
    user_habit_id: 1
  },
  {
    daily_goal_amount: "75 g",
    description: null,
    done_on: 1548970200000,
    id: 3,
    name: "eat carrots",
    quantity: 2,
    user_habit_id: 2
  },
  {
    daily_goal_amount: "1 mile",
    description: null,
    done_on: 1548981000000,
    id: 4,
    name: "walk",
    quantity: 1,
    user_habit_id: 3
  },
  {
    daily_goal_amount: "1 cup",
    description: null,
    done_on: 1548955800000,
    id: 5,
    name: "make my own coffee in the morning",
    quantity: 2,
    user_habit_id: 4
  },
  {
    daily_goal_amount: "1 cup",
    description: null,
    done_on: 1549125000000,
    id: 6,
    name: "make my own coffee in the morning",
    quantity: 2,
    user_habit_id: 4
  },
  {
    daily_goal_amount: "once per day",
    description: null,
    done_on: 1548964800000,
    id: 7,
    name: "bring my own lunch",
    quantity: 1,
    user_habit_id: 5
  },
  {
    daily_goal_amount: "once per day",
    description: null,
    done_on: 1548964800000,
    id: 8,
    name: "bring my own lunch",
    quantity: 1,
    user_habit_id: 5
  }
];

const expectedHabits = [
  {
    id: 1,
    category_id: 1,
    name: "eat broccoli",
    description: null,
    daily_goal_amount: "100 g",
    weight: 0.25
  },
  {
    id: 2,
    category_id: 1,
    name: "eat carrots",
    description: null,
    daily_goal_amount: "75 g",
    weight: 0.25
  },
  {
    id: 3,
    category_id: 1,
    name: "walk",
    description: null,
    daily_goal_amount: "1 mile",
    weight: 0.5
  },
  {
    id: 4,
    category_id: 2,
    name: "make my own coffee in the morning",
    description: null,
    daily_goal_amount: "1 cup",
    weight: 0.4
  },
  {
    id: 5,
    category_id: 2,
    name: "bring my own lunch",
    description: null,
    daily_goal_amount: "once per day",
    weight: 0.6
  }
];
// Test GET api/users/1/* restricted routes
describe.each`
  route               | expected
  ${"categories"}     | ${expectedCategories}
  ${"habits"}         | ${expectedHabits}
  ${"tracked_habits"} | ${expectedTrackedHabits}
`("GET api/users/1/$route", ({ route, expected }) => {
  const contextClassRef = ContextHelper;
  beforeAll(async () => {
    try {
      await db.seed.run();
      const authTest = await request(server)
        .post("/api/users/login")
        .send(testUser);
      contextClassRef.session = authTest.header["set-cookie"];
    } catch (err) {
      console.log(`Error on test login! ${err}`);
    }
  });
  it(`when logged-in, should return ${expected}`, async () => {
    console.log(`**** ${contextClassRef.session} ****`);

    const response = await request(server)
      .get(`/api/users/1/${route}`)
      .set("Cookie", contextClassRef.session);
    //console.log(response);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expected);
    expect(response.type).toEqual("application/json");
  });
  it(`when logged-out, should return {"message":"You're not allowed in here!"}`, async () => {
    const response = await request(server).get(`/api/users/1/${route}`);
    const restricted = { message: "You're not allowed in here!" };
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(restricted);
    expect(response.type).toEqual("application/json");
  });
});

// Test GET / on index route to check if server is running
describe("server.js", () => {
  describe("index route", () => {
    it("should return an OK status code from the index route", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).get("/");
      expect(response.status).toEqual(expectedStatusCode);
    });

    it("should return confirmation message that server is running", async () => {
      const expectedBody = "Server up and running...";
      const response = await request(server).get("/");
      console.log(`!!! ${response.text}`);
      expect(response.text).toEqual(expectedBody);
    });

    it("should return text from the index route", async () => {
      const response = await request(server).get("/");
      expect(response.type).toEqual("text/html");
    });
  });
});

// Test GET api/$route
const expectedUserCategories = [
  { category_id: 1, id: 1, user_id: 1, weight: 0.3 },
  { category_id: 2, id: 2, user_id: 1, weight: 0.7 },
  { category_id: 1, id: 3, user_id: 2, weight: 0.9 },
  { category_id: 2, id: 4, user_id: 2, weight: 0.1 }
];

const expectedUserHabits = [
  {
    category_id: 1,
    daily_goal_amount: "100 g",
    description: null,
    id: 1,
    name: "eat broccoli",
    user_id: 1,
    weight: 0.25
  },
  {
    category_id: 1,
    daily_goal_amount: "75 g",
    description: null,
    id: 2,
    name: "eat carrots",
    user_id: 1,
    weight: 0.25
  },
  {
    category_id: 1,
    daily_goal_amount: "1 mile",
    description: null,
    id: 3,
    name: "walk",
    user_id: 1,
    weight: 0.5
  },
  {
    category_id: 2,
    daily_goal_amount: "1 cup",
    description: null,
    id: 4,
    name: "make my own coffee in the morning",
    user_id: 1,
    weight: 0.4
  },
  {
    category_id: 2,
    daily_goal_amount: "once per day",
    description: null,
    id: 5,
    name: "bring my own lunch",
    user_id: 1,
    weight: 0.6
  },
  {
    category_id: 1,
    daily_goal_amount: "10",
    description: null,
    id: 6,
    name: "do pushups",
    user_id: 2,
    weight: 0.25
  },
  {
    category_id: 1,
    daily_goal_amount: "25",
    description: null,
    id: 7,
    name: "do situps",
    user_id: 2,
    weight: 0.25
  },
  {
    category_id: 1,
    daily_goal_amount: "2 miles",
    description: null,
    id: 8,
    name: "walk",
    user_id: 2,
    weight: 0.5
  },
  {
    category_id: 2,
    daily_goal_amount: "daily",
    description: null,
    id: 9,
    name: "record expenses in budget",
    user_id: 2,
    weight: 0.2
  },
  {
    category_id: 2,
    daily_goal_amount: "30 minutes",
    description: null,
    id: 10,
    name: "work on business ideas",
    user_id: 2,
    weight: 0.8
  }
];

const expectedHabitTracking = [
  { done_on: 1548966600000, id: 1, quantity: 1, user_habit_id: 1 },
  { done_on: 1549139400000, id: 2, quantity: 2, user_habit_id: 1 },
  { done_on: 1548970200000, id: 3, quantity: 2, user_habit_id: 2 },
  { done_on: 1548981000000, id: 4, quantity: 1, user_habit_id: 3 },
  { done_on: 1548955800000, id: 5, quantity: 2, user_habit_id: 4 },
  { done_on: 1549125000000, id: 6, quantity: 2, user_habit_id: 4 },
  { done_on: 1548964800000, id: 7, quantity: 1, user_habit_id: 5 },
  { done_on: 1548964800000, id: 8, quantity: 1, user_habit_id: 5 },
  { done_on: 1548979200000, id: 9, quantity: 1.5, user_habit_id: 6 },
  { done_on: 1548980100000, id: 10, quantity: 1, user_habit_id: 7 },
  { done_on: 1548987300000, id: 11, quantity: 2, user_habit_id: 8 },
  { done_on: 1548972900000, id: 12, quantity: 1, user_habit_id: 9 },
  { done_on: 1548991800000, id: 13, quantity: 1.5, user_habit_id: 10 }
];

const expectedFirstUserCategory = {"category_id": 1, "id": 1, "user_id": 1, "weight": 0.3};

const expectedFirstUserHabit = {"category_id": 1, "daily_goal_amount": "100 g", "description": null, "id": 1, "name": "eat broccoli", "user_id": 1, "weight": 0.25};

const expectedFirstHabitTracking = {"done_on": 1548966600000, "id": 1, "quantity": 1, "user_habit_id": 1};

describe.each`
  route                | indexExpected               | firstExpected
  ${"user_categories"} | ${expectedUserCategories}   | ${expectedFirstUserCategory}
  ${"user_habits"}     | ${expectedUserHabits}       | ${expectedFirstUserHabit}
  ${"habit_tracking"}  | ${expectedHabitTracking}    | ${expectedFirstHabitTracking}
`("GET api/$route and GET api/$route/1", ({ route, indexExpected, firstExpected }) => {
  const contextClassRef = ContextHelper;
  beforeAll(async () => {
    try {
      await db.seed.run();
      const authTest = await request(server)
        .post("/api/users/login")
        .send(testUser);
      contextClassRef.session = authTest.header["set-cookie"];
    } catch (err) {
      console.log(`Error on test login! ${err}`);
    }
  });
  describe("when logged-in", () => {
    it(`should return ${indexExpected}`, async () => {
      //console.log(`**** ${contextClassRef.session} ****`);

      const response = await request(server)
        .get(`/api/${route}`)
        .set("Cookie", contextClassRef.session);
      //console.log(response);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(indexExpected);
      expect(response.type).toEqual("application/json");
    });
    it(`should return ${firstExpected}`, async () => {
      //console.log(`**** ${contextClassRef.session} ****`);

      const response = await request(server)
        .get(`/api/${route}/1`)
        .set("Cookie", contextClassRef.session);
      //console.log(response);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(firstExpected);
      expect(response.type).toEqual("application/json");
    });
  });
  it(`when logged-out, should return {"message":"You're not allowed in here!"}`, async () => {
    const response = await request(server).get(`/api/${route}`);
    const restricted = { message: "You're not allowed in here!" };
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(restricted);
    expect(response.type).toEqual("application/json");
  });
});
