const express = require('express');
const app = require('../app');
const router = express.Router();
const mysql =  require("../mysql").pool;
const bcrypt = require('bcrypt');
const AuthMiddleware = require('../middleware/AuthMiddleware');

router.get('/', AuthMiddleware.mandatory, (req, res, next)=>{

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error }) }

        conn.query(
            'SELECT * FROM user;',
            [req.body.id],
            
            (error, result, fields) => {
                
                if(error){ return res.status(500).send({ error : error }) }

                return res.status(200).send({ response: result });
            }
        )
    });
});

router.post('/', (req, res, next) =>{

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error });}

        conn.query('SELECT * FROM user WHERE email = ?', [req.body.email], (error, results) => {

            if(error){

                return  res.status(500).send({
                      error: error,
                      response: null
                  })}

            if(results.length > 0){

                res.status(401).send({
                    message:'E-mail já cadastrado!'
                })

            }

            else{
                
                bcrypt.hash(req.body.password, 10, (errBcrypt, hash) =>{

                    if (errBcrypt){
                        return res.status(500).send({ error : errBcrypt })
                    }
        
                    conn.query(
                        'INSERT INTO user (admin, cpf, name, surname, email, password, active, street, neighborhood, city, cep) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                        [req.body.admin, req.body.cpf, req.body.name, req.body.surname, req.body.email, hash, req.body.active, req.body.street, req.body.neighborhood, req.body.city, req.body.cep],
                        
                        (error, result, field) => {
                            conn.release();
            
                            if(error){
                              return  res.status(500).send({
                                    error: error,
                                    response: null
                                });
                            } 
                            res.status(201).send({
                                message : 'Usuário inserido com sucesso!',
                                id_user : result.insertId
                            });
                        }
                    )
        
                });
            }
        })
    });

});

router.patch('/:id', AuthMiddleware.mandatory, (req, res, next) =>{

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error });}

        conn.query(
            'UPDATE user SET admin = ?, cpf = ?, name = ?, surname = ?, email = ?, password = ?, active = ?, street = ?, neighborhood = ?, city = ?, cep = ? WHERE id = ?',             
            [req.body.admin, req.body.cpf, req.body.name, req.body.surname, req.body.email, req.body.password, req.body.active, req.body.street, req.body.neighborhood, req.body.city, req.body.cep, req.body.id],
            
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
            'DELETE FROM user WHERE id = ?',             
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
                    message : 'Usuário removido com sucesso!'
                });
            }
        )

    });

});

module.exports = router;