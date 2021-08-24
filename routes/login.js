const express = require('express');
const app = require('../app');
const router = express.Router();
const mysql =  require("../mysql").pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', (req, res, next) =>{

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error : error}) }
        const query = 'SELECT * FROM user WHERE email = ?';

        conn.query(query,[req.body.email],(error, results, fields) => {
            conn.release();

            if(error) { return res.status(500).send({error : error}) }

            if(results.length < 1){
                return res.status(401).send({message: 'Falha na autenticação!'})
            }

            bcrypt.compare(req.body.password, results[0].password, (err, result) => {

                const pass = bcrypt.compare(req.body.password, results[0].password);
                
                if (err){
                    return res.status(401).send({message: 'Falha na autenticação!'})
                }

                if (result){

                    const id = results[0].id;
                    const admin = results[0].admin;

                    const token = jwt.sign({
                        id_usuario: results[0].id,
                        email: results[0].email 
                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn: "24h"
                    });

                    return res.status(200).send({
                        id_usuario: id,
                        admin: admin,
                        token: token
                    });

                }

                return res.status(401).send({valido:false})
            });
        });
    });
})

module.exports = router;


