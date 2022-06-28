
process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");

describe("GET /companies", () => {
    test("Gets a list of companies", async () => {
        const response = await request(app).get(`/companies`);
        expect(response.statusCode).toEqual(200);
    });
});

describe("GET /companies/:company", () => {
    test("Gets a single company", async () => {
        const response = await request(app).get(`/companies/apple`);
        expect(response.statusCode).toEqual(200);
    });
  
    test("Responds with 404 if can't find company", async () => {
        const response = await request(app).get(`/companies/app`);
        expect(response.statusCode).toEqual(404);
    });
});

describe("POST /companies", () => {
    test("Creates a new commpany", async () => {
        const response = await request(app)
            .post(`/companies`)
            .send({
            code: "net",
            name: "netflix"
            });
        expect(response.statusCode).toEqual(201);
    });
});

describe("PUT /companies/:company", () => {
    test("Updates a single company", async () => {
        const response = await request(app)
            .put(`/companies/net`)
            .send({
            name: "netify",
            description: "A free website host"
            });
        expect(response.statusCode).toEqual(200);
    });
  
    test("Responds with 404 if can't find company", async () => {
        const response = await request(app).patch(`/companies/xyz`);
        expect(response.statusCode).toEqual(404);
    });
});

describe("DELETE /companies/net", () => {
    test("Deletes a single company", async () => {
        const response = await request(app)
            .delete(`/companies/net`);
        expect(response.statusCode).toEqual(200);
    });

    test("Responds with 404 if can't find company", async () => {
        const response = await request(app).patch(`/companies/xyz`);
        expect(response.statusCode).toEqual(404);
    });
});
