const express = require('express');
const app = require('../app');
const router = express.Router();
const mysql =  require("../mysql").pool;
const AuthMiddleware = require('../middleware/AuthMiddleware');

router.get('/:id', AuthMiddleware.mandatory, (req, res, next)=>{

    const id = req.params.id;

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error }) }

        conn.query(
            'SELECT * FROM harvest WHERE user = ?',
            id,
            
            (error, result, fields) => {
                
                if(error){ return res.status(500).send({ error : error }) }

                return res.status(200).send({ response: result });
            }
        )
    });
});

router.post('/', AuthMiddleware.mandatory, (req, res, next) =>{

    mysql.getConnection((error, conn) => {

        if(error){ return res.status(500).send({ error : error });}

        conn.query(
            'INSERT INTO harvest (user, functionary, description, quantity, date, unit) VALUES (?,?,?,?,?,?)',
            [req.body.user, req.body.functionary, req.body.description, req.body.quantity, req.body.date, req.body.unit],
            
            (error, result, field) => {
                conn.release();

                if(error){
                  return  res.status(500).send({
                        error: error,
                        response: null
                    });
                } 
                res.status(201).send({
                    message : 'Colheita inserida com sucesso!',
                    id_harvest : result.insertId
                });
            }
        )

    });

});

router.patch('/', AuthMiddleware.mandatory, (req, res, next) =>{

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error });}

        conn.query(
            'UPDATE harvest SET functionary = ?, description = ?, quantity = ?, date = ?, unit = ? WHERE id = ?',             
            [req.body.functionary, req.body.description, req.body.quantity, req.body.date, req.body.unit, req.body.id],
            
            (error, result, field) => {
                conn.release();

                if(error){
                  return  res.status(500).send({
                        error: error,
                        response: null
                    });
                } 
                res.status(202).send({
                    message : 'Alteração concluída com sucesso!'
                });
            }
        )

    });

});

router.delete('/:id', AuthMiddleware.mandatory, (req, res, next) => {

    const id = req.params.id;

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error });}

        conn.query(
            'DELETE FROM harvest WHERE id = ?',             
            id,
            
            (error, result, field) => {
                conn.release();

                if(error){
                  return  res.status(500).send({
                        error: error,
                        response: null
                    });
                } 
                res.status(202).send({
                    message : 'Colheita removida com sucesso!'
                });
            }
        )

    });

});

module.exports = router;