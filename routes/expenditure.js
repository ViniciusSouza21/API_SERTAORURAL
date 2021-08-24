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
            'SELECT * FROM expenditure WHERE user = ?;',
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
            'INSERT INTO expenditure (user, description, date, value, pay, frequency) VALUES (?,?,?,?,?,?)',
            [req.body.user, req.body.description, req.body.date, req.body.value, req.body.pay, req.body.frequency],
            
            (error, result, field) => {
                conn.release();

                if(error){
                  return  res.status(500).send({
                        error: error,
                        response: null
                    });
                } 
                res.status(201).send({
                    message : 'Despesa inserida com sucesso!',
                    id_colheita : result.insertId
                });
            }
        )

    });

});

router.patch('/', AuthMiddleware.mandatory, (req, res, next) =>{

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error });}

        conn.query(
            'UPDATE expenditure SET description = ?, date = ?, value = ?, pay = ?, frequency = ? WHERE id = ?',             
            [req.body.description, req.body.date, req.body.value, req.body.pay, req.body.frequency, req.body.id],
            
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

router.delete('/:id', AuthMiddleware.mandatory, (req, res, next) =>{

    const id = req.params.id;

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error });}

        conn.query(
            'DELETE FROM expenditure WHERE id = ?',             
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
                    message : 'Despesa removida com sucesso!'
                });
            }
        )

    });

});

module.exports = router;
