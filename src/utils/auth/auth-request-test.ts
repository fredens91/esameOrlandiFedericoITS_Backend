import request from "supertest";
import app from "../../app";

export const createAuthRequest = (authToken: string) => ({
  get: (url: string) =>
    request(app).get(url).set("Authorization", `Bearer ${authToken}`),
  post: (url: string) =>
    request(app).post(url).set("Authorization", `Bearer ${authToken}`),
  put: (url: string) =>
    request(app).put(url).set("Authorization", `Bearer ${authToken}`),
  delete: (url: string) =>
    request(app).delete(url).set("Authorization", `Bearer ${authToken}`),
});
