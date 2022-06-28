
const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");

router.get("/", async (req, res, next) => {
    try{
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({ invoices: results.rows });
    }
    catch(err){
        return next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try{
        const invoice = req.params.id;
        const invoiceQuery = await db.query(
            `SELECT * 
                FROM invoices 
                WHERE id = '${invoice}'`
        );

        if(invoiceQuery.rows.length === 0){
            let notFoundError = new Error(`There is no invoice with id ${req.params.id}`);
            notFoundError.status = 404;
            throw notFoundError;
        }

        const companyQuery = await db.query(
            `SELECT *
                FROM companies
                WHERE code = $1`,
                [invoiceQuery.rows[0].comp_code]
        );

        return res.json({ 
            invoice: invoiceQuery.rows[0], 
            company: companyQuery.rows[0]
        });
    }
    catch(err){
        return next(err);
    }
});

router.post("/", async (req, res, next) => {
    try{
        const {comp_code, amt} = req.body;
        const companyQuery = await db.query(
            `SELECT * FROM companies 
                WHERE code = '${comp_code}'`
        );

        if(companyQuery.rows.length === 0){
            let notFoundError = new Error(`There is no company with comp_code ${comp_code}`);
            notFoundError.status = 404;
            throw notFoundError;
        }

        const results = await db.query(
            `INSERT INTO invoices (comp_code, amt)
                VALUES ($1, $2)
                RETURNING *`,
                [comp_code, amt]
        );
    
        return res.status(201).json({invoice: results.rows[0]});
    }
    catch(err){
        return next(err);
    }
});

router.put("/:id", async (req, res, next) => {
    try{
        const id = req.params.id;
        const amt = req.body.amt;
        const results = await db.query(
            `UPDATE invoices
                SET amt = $1
                WHERE id = $2
                RETURNING *`,
                [amt, id]
        );
        
        if(results.rows.length === 0){
            let notFoundError = new Error(`There is no invoice with id ${id}`);
            notFoundError.status = 404;
            throw notFoundError;
        }

        return res.json({ invoice: results.rows[0] });
    }
    catch(err){
        return next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try{
        const invoice = req.params.id;
        const results = await db.query(
            `DELETE FROM invoices
                WHERE id = $1
                RETURNING *`, 
                [invoice]
        );

        if(results.rows.length === 0){
            let notFoundError = new Error(`There is no invoice with id ${invoice}`);
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
