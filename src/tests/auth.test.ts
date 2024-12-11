import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import postsModel from "../models/posts_model";
import userModel from "../models/user_model";

import testPostsData from "./test_posts.json";
import { Express } from "express";

let app: Express;

type Post = {
  _id?: string;
  title: string;
  content: string;
  owner: string;
}
const testPosts: Post[] = testPostsData;

beforeAll(async () => {
  console.log("Before all tests");
  app = await appInit();
  await postsModel.deleteMany();
  await userModel.deleteMany();
});

afterAll(() => {
  console.log("After all tests");
  mongoose.connection.close();
});

type User = {
  email: string;
  password: string;
  token?: string;
}

const testUser: User = {
  email: "user@test.com",
  password: "1234567",
}

describe("Auth Test", () => {
  test("Test registration", async () => {
    const response = await request(app).post("/auth/register").send(testUser);
    expect(response.statusCode).toBe(200);
  });

  test("Test registration fail", async () => {
    const response = await request(app).post("/auth/register").send(testUser);
    expect(response.statusCode).not.toBe(200);
  });

  test("Test registration fail", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "",
    });
    expect(response.statusCode).not.toBe(200);
  });

  test("Test login", async () => {
    const response = await request(app).post("/auth/login").send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.token = response.body.token;
    expect(testUser.token).toBeDefined();
    console.log("Token: ", testUser.token);
  });

  test("Test login", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app).post("/auth/login").send({
      email: "asdfasdf",
      password: "wrongpassword",
    });
    expect(response2.statusCode).not.toBe(200);
  });


  test("Using token", async () => {
    const response = await request(app).post("/posts").send(testPosts[0]);
    expect(response.statusCode).not.toBe(201);

    const response2 = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send(testPosts[0]);
    expect(response2.statusCode).toBe(201);

    const response3 = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.token + 'f' })
      .send(testPosts[0]);
    expect(response3.statusCode).not.toBe(201);
  });
});