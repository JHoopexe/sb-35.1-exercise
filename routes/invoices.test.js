
process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");

describe("GET /invoices", () => {
    test("Gets a list of invoices", async () => {
        const response = await request(app).get(`/invoices`);
        expect(response.statusCode).toEqual(200);
    });
});

describe("GET /invoices/:id", () => {
    test("Gets a single invoice", async () => {
        const response = await request(app).get(`/invoices/1`);
        expect(response.statusCode).toEqual(200);
    });
  
    test("Responds with 404 if can't find invoice", async () => {
        const response = await request(app).get(`/invoices/0`);
        expect(response.statusCode).toEqual(404);
    });
});

describe("POST /invoices", () => {
    test("Creates a new invoice", async () => {
        const response = await request(app)
            .post(`/invoices`)
            .send({
                comp_code: "ibm",
                amt: 400
            });
        expect(response.statusCode).toEqual(201);
    });

    test("Responds with 404 if can't find invoice", async () => {
        const response = await request(app)
            .post(`/invoices`)
            .send({
                comp_code: "xyz",
                amt: 400
            });
        expect(response.statusCode).toEqual(404);
    });
});

describe("PUT /invoices/:id", () => {
    test("Updates a single invoice", async () => {
        const response = await request(app)
            .put(`/invoices/1`)
            .send({amt: 300});
        expect(response.statusCode).toEqual(200);
    });
  
    test("Responds with 404 if can't find invoice", async () => {
        const response = await request(app)
        .put(`/invoices/0`)
        .send({amt: 300});
        expect(response.statusCode).toEqual(404);
    });
});

describe("DELETE /invoices/:id", () => {
    test("Deletes a single invoice", async () => {
        const response = await request(app)
            .delete(`/invoices/8`);
        expect(response.statusCode).toEqual(200);
    });

    test("Responds with 404 if can't find invoice", async () => {
        const response = await request(app).delete(`/invoices/0`);
        expect(response.statusCode).toEqual(404);
    });
});
