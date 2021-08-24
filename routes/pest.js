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
            'SELECT * FROM pests WHERE id_plantation = ?;',
            id,
            
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
            'INSERT INTO pests (insecticide, description, identified, fought) VALUES (?,?,?,?)',
            [req.body.insecticide, req.body.description, req.body.identified, req.body.fought],
            
            (error, result, field) => {
                conn.release();

                if(error){
                  return  res.status(500).send({
                        error: error,
                        response: null
                    });
                } 
                res.status(201).send({
                    message : 'Praga adicionada ao sistema com sucesso!'
                });
            }
        )

    });

});

router.patch('/', AuthMiddleware.mandatory, (req, res, next) =>{

    mysql.getConnection((error, conn) =>{

        if(error){ return res.status(500).send({ error : error });}

        conn.query(
            'UPDATE pests SET insecticide = ?, description = ?, identified = ?, fought = ? WHERE id = ?',             
            [req.body.insecticide, req.body.description, req.body.identified, req.body.fought, req.body.id],
            
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
            'DELETE FROM pests WHERE id = ?',             
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
                    message : 'Praga removida com sucesso!'
                });
            }
        )

    });

});

module.exports = router;