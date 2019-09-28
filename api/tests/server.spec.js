const request = require("supertest");
const server = require("../server.js");
const db = require("../../data/dbConfig.js");
// this class below is used as a workaround to an asyn/await scope problem during the login process
class ContextHelper {}

const {
  testUser,
  testRegisterUser,
  testRegisterResponse,
  expectedCategories,
  expectedTrackedHabits,
  expectedHabits,
  expectedUserCategories,
  expectedUserHabits,
  expectedHabitTracking,
  expectedFirstUserCategory,
  expectedFirstUserHabit,
  expectedFirstHabitTracking,
  postUserCategory,
  expectedPostUserCategory,
  expectedPutUserCategory,
  postUserHabit,
  expectedPostUserHabit,
  expectedPutUserHabit,
  postHabitTracking,
  expectedPostHabitTracking,
  expectedPutHabitTracking
} = require("./setupTests.js");

const seedDB = async () => {
  try {
    await db.seed.run();
  } catch (err) {
    console.log(`Error on seeding! ${err}`);
  }
};

const cookieMaker = async () => {
  try {
    const authTest = await request(server)
      .post("/api/users/login")
      .send(testUser);
    return authTest.header["set-cookie"];
  } catch (err) {
    console.log(`Error on cookie making! ${err}`);
  }
};

const contextClassRef2 = ContextHelper;
contextClassRef2.session2 = cookieMaker();


describe("Register with POST /api/users/register", () => {
  const expected = testRegisterResponse;
  beforeAll(() => seedDB());
  it(`should return ${expected}`, async () => {
    const response = await request(server)
      .post(`/api/users/register`)
      .send(testRegisterUser);
    expect(response.status).toEqual(201);
    // just test that we get back the username we used to register
    // otherwise have to implement a bcrypt compare function here... TODO?
    expect(response.body.username).toEqual(testRegisterUser.username);
    expect(response.type).toEqual("application/json");
  });
});

describe("Login with POST /api/users/login", () => {
  const expected = { message: "Welcome test1!" };
  beforeAll(() => seedDB());
  it(`should return ${expected}`, async () => {
    const response = await request(server)
      .post(`/api/users/login`)
      .send(testUser);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expected);
    expect(response.type).toEqual("application/json");
  });
});

// Test GET /api/users/1/* restricted routes
describe.each`
  route               | expected
  ${"categories"}     | ${expectedCategories}
  ${"habits"}         | ${expectedHabits}
  ${"tracked_habits"} | ${expectedTrackedHabits}
`("GET /api/users/1/$route", ({ route, expected }) => {
  //const contextClassRef = ContextHelper;
  beforeAll( async () => {
    await seedDB();
  });
  it(`when logged-in, should return ${expected}`, async () => {
    console.log(`**** ${contextClassRef2.session2} ****`);

    const response = await request(server)
      .get(`/api/users/1/${route}`)
      .set("Cookie", await contextClassRef2.session2);
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

// Test GET /api/$route

describe.each`
  route                | indexExpected             | firstExpected
  ${"user_categories"} | ${expectedUserCategories} | ${expectedFirstUserCategory}
  ${"user_habits"}     | ${expectedUserHabits}     | ${expectedFirstUserHabit}
  ${"habit_tracking"}  | ${expectedHabitTracking}  | ${expectedFirstHabitTracking}
`(
  "GET /api/$route, GET /api/$route/1 and DELETE /api/$route/1",
  ({ route, indexExpected, firstExpected }) => {
    //const contextClassRef = ContextHelper;
    beforeAll(async () => {
      await seedDB();
    });
    describe("when logged-in", () => {
      it(`GET /api/${route} should return ${indexExpected}`, async () => {
        //console.log(`**** ${contextClassRef.session} ****`);

        const response = await request(server)
          .get(`/api/${route}`)
          .set("Cookie", await contextClassRef2.session2);
        //console.log(response);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(indexExpected);
        expect(response.type).toEqual("application/json");
      });
      it(`GET /api/${route}/1 should return ${firstExpected}`, async () => {
        //console.log(`**** ${contextClassRef.session} ****`);

        const response = await request(server)
          .get(`/api/${route}/1`)
          .set("Cookie", await contextClassRef2.session2);
        //console.log(response);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(firstExpected);
        expect(response.type).toEqual("application/json");
      });
      it(`DELETE /api/${route}/1 should return ${firstExpected}`, async () => {
        //console.log(`**** ${contextClassRef.session} ****`);

        const response = await request(server)
          .delete(`/api/${route}/1`)
          .set("Cookie", await contextClassRef2.session2);
        //console.log(response);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(firstExpected);
        expect(response.type).toEqual("application/json");
      });
    });
    describe("when logged-out", () => {
      it(`GET /api/${route} should return {"message":"You're not allowed in here!"}`, async () => {
        const response = await request(server).get(`/api/${route}`);
        const restricted = { message: "You're not allowed in here!" };
        expect(response.status).toEqual(400);
        expect(response.body).toEqual(restricted);
        expect(response.type).toEqual("application/json");
      });
      it(`GET /api/${route}/1 should return {"message":"You're not allowed in here!"}`, async () => {
        const response = await request(server).get(`/api/${route}/1`);
        const restricted = { message: "You're not allowed in here!" };
        expect(response.status).toEqual(400);
        expect(response.body).toEqual(restricted);
        expect(response.type).toEqual("application/json");
      });
      it(`DELETE /api/${route}/1 should return {"message":"You're not allowed in here!"}`, async () => {
        const response = await request(server).delete(`/api/${route}/1`);
        const restricted = { message: "You're not allowed in here!" };
        expect(response.status).toEqual(400);
        expect(response.body).toEqual(restricted);
        expect(response.type).toEqual("application/json");
      });
    });
  }
);

// Test POST /api/$route

describe.each`
  route                | dataToSend           | postExpected                 | putExpected
  ${"user_categories"} | ${postUserCategory}  | ${expectedPostUserCategory}  | ${expectedPutUserCategory}
  ${"user_habits"}     | ${postUserHabit}     | ${expectedPostUserHabit}     | ${expectedPutUserHabit}
  ${"habit_tracking"}  | ${postHabitTracking} | ${expectedPostHabitTracking} | ${expectedPutHabitTracking}
`("/api/$route", ({ route, dataToSend, postExpected, putExpected }) => {
  //const contextClassRef = ContextHelper;
  beforeAll(async () => {
    await seedDB();
  });
  describe("when logged-in", () => {
    it(`POST should return ${postExpected}`, async () => {
      //console.log(`**** ${contextClassRef.session} ****`);

      const response = await request(server)
        .post(`/api/${route}`)
        .send(dataToSend)
        .set("Cookie", await contextClassRef2.session2);
      //console.log(response);
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(postExpected);
      expect(response.type).toEqual("application/json");
    });
    it(`PUT should return ${putExpected}`, async () => {
      //console.log(`**** ${contextClassRef.session} ****`);
      const response = await request(server)
        .put(`/api/${route}/1`)
        .send(dataToSend)
        .set("Cookie", await contextClassRef2.session2);
      //console.log(`****~~~ ${JSON.stringify(response)}`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(putExpected);
      expect(response.type).toEqual("application/json");
    });
  });

  describe("when logged-out", () => {
    it(`POST should return {"message":"You're not allowed in here!"}`, async () => {
      const response = await request(server)
        .post(`/api/${route}`)
        .send(dataToSend);
      const restricted = { message: "You're not allowed in here!" };
      expect(response.status).toEqual(400);
      expect(response.body).toEqual(restricted);
      expect(response.type).toEqual("application/json");
    });
    it(`PUT should return {"message":"You're not allowed in here!"}`, async () => {
      const response = await request(server)
        .put(`/api/${route}/1`)
        .send(dataToSend);
      const restricted = { message: "You're not allowed in here!" };
      expect(response.status).toEqual(400);
      expect(response.body).toEqual(restricted);
      expect(response.type).toEqual("application/json");
    });
  });
});

//test
