
const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");

router.get("/", async (req, res, next) => {
    try{
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({ companies: results.rows });
    }
    catch(err){
        return next(err);
    }
});

router.get("/:company", async (req, res, next) => {
    try{
        const company = req.params.company;
        const companyQuery = await db.query(
            `SELECT * 
                FROM companies 
                WHERE code = '${company}'`
        );

        if(companyQuery.rows.length === 0){
            let notFoundError = new Error(`There is no company with code ${req.params.company}`);
            notFoundError.status = 404;
            throw notFoundError;
        }

        const invoiceQuery = await db.query(
            `SELECT *
                FROM invoices
                WHERE comp_code = $1`,
                [companyQuery.rows[0].code]
        );

        return res.json({ 
            company: companyQuery.rows[0],
            invoices: invoiceQuery.rows
        });
    }
    catch(err){
        return next(err);
    }
});

router.post("/", async (req, res, next) => {
    try{
        const {code, name} = req.body;
        const results = await db.query(
            `INSERT INTO companies (code, name)
                VALUES ($1, $2)
                RETURNING code, name`,
                [code, name]
        );
    
        return res.status(201).json({company: results.rows[0]});
    }
    catch(err){
        return next(err);
    }
});

router.put("/:company", async (req, res, next) => {
    try{
        const company = req.params.company;
        const {name, description} = req.body;
        const results = await db.query(
            `UPDATE companies
                SET name = $1, description = $2
                WHERE code = $3
                RETURNING code, name, description`,
                [name, description, company]
        );
        
        if(results.rows.length === 0){
            let notFoundError = new Error(`There is no company with code ${company}`);
            notFoundError.status = 404;
            throw notFoundError;
        }

        return res.json({ companies: results.rows[0] });
    }
    catch(err){
        return next(err);
    }
});

router.delete("/:company", async (req, res, next) => {
    try{
        const company = req.params.company;
        const results = await db.query(
            `DELETE FROM companies 
                WHERE code = $1
                RETURNING *`, 
                [company]
        );

        if(results.rows.length === 0){
            let notFoundError = new Error(`There is no company with code ${company}`);
            notFoundError.status = 404;
            throw notFoundError;
        }

        return res.json({ status: "deleted" });
    }
    catch(err){
        return next(err);
    }
});

module.exports = router;
