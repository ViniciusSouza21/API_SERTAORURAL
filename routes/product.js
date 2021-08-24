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
            'SELECT * FROM product WHERE supplier = ?;',
            id,
            
            (error, result, fields) => {
                
                if(error){ return res.status(500).send({ error : error }) }

                return res.status(200).send({ response: result });
            }
        )
    });
});

router.post('/', AuthMiddleware.mandatory, (req, res, next) =>{

    console.log(req.usuario);

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error });}

        conn.query(
            'INSERT INTO product (supplier, description, value, available, unit, category, name) VALUES (?,?,?,?,?,?,?)',
            [req.body.supplier, req.body.description, req.body.value, req.body.available, req.body.unit, req.body.category, req.body.name],
            
            (error, result, field) => {
                conn.release();

                if(error){
                  return  res.status(500).send({
                        error: error,
                        response: null
                    });
                } 
                res.status(201).send({
                    message : 'Produto inserido com sucesso!',
                    id_product: result.insertId
                });
            }
        )

    });

});

router.patch('/', AuthMiddleware.mandatory, (req, res, next) =>{

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error });}

        conn.query(
            'UPDATE product SET description = ?, value = ?, available = ?, unit = ?, category = ?, name = ? WHERE id = ?',             
            [req.body.description, req.body.value, req.body.available, req.body.unit, req.body.category, req.body.name, req.body.id],
            
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
            'DELETE FROM product WHERE id = ?',             
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
                    message : 'Produto removido com sucesso!'
                });
            }
        )

    });

});

module.exports = router;