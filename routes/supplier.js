const express = require('express');
const app = require('../app');
const router = express.Router();
const mysql =  require("../mysql").pool;
const AuthMiddleware = require('../middleware/AuthMiddleware');

router.get('/', AuthMiddleware.mandatory, (req, res, next)=>{

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error }) }

        conn.query(
            'SELECT * FROM supplier;',
            [req.body.id],
            
            (error, result, fields) => {
                
                if(error){ return res.status(500).send({ error : error }) }

                return res.status(200).send({ response: result });
            }
        )
    });
});

router.post('/', AuthMiddleware.mandatory, (req, res, next) =>{

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error });}

        conn.query(
            'INSERT INTO supplier (name, email, phone, cnpj, description, street, neighborhood, city, cep, url) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [req.body.name, req.body.email, req.body.phone, req.body.cnpj, req.body.description, req.body.street, req.body.neighborhood, req.body.city, req.body.cep, req.body.url],
            
            (error, result, field) => {
                conn.release();

                if(error){
                  return  res.status(500).send({
                        error: error,
                        response: null
                    });
                } 
                res.status(201).send({
                    message : 'Fornecedor Inserido com sucesso!',
                    id_supplier : result.insertId
                });
            }
        )

    });

});

router.patch('/', AuthMiddleware.mandatory, (req, res, next) =>{

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error });}

        conn.query(
            'UPDATE supplier SET name = ?, email = ?, phone = ?, cnpj = ?, description = ?, street = ?, neighborhood = ?, city = ?, cep = ? WHERE id = ?',             
            [req.body.name, req.body.email, req.body.phone, req.body.cnpj, req.body.description, req.body.street, req.body.neighborhood, req.body.city, req.body.cep, req.body.id],
            
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
            'DELETE FROM supplier WHERE id = ?',             
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
                    message : 'Fornecedor removido com sucesso!'
                });
            }
        )

    });

});

module.exports = router;