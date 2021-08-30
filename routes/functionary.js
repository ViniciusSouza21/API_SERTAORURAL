const express = require("express");
const app = require("../app");
const router = express.Router();
const mysql = require("../mysql").pool;
const AuthMiddleware = require("../middleware/AuthMiddleware");

router.get("/:id", AuthMiddleware.mandatory, (req, res, next) => {
  const id = req.params.id;

  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      "SELECT * FROM functionary WHERE employer = ?;",
      id,

      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        return res.status(200).send({ response: result });
      }
    );
  });
});

router.post("/", AuthMiddleware.mandatory, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      "INSERT INTO functionary (employer, name, wage, Workeddays, street, neighborhood, city, cep) VALUES (?,?,?,?,?,?,?,?)",
      [
        req.body.employer,
        req.body.name,
        req.body.wage,
        req.body.Workeddays,
        req.body.street,
        req.body.neighborhood,
        req.body.city,
        req.body.cep,
      ],

      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(201).send({
          message: "Funcionario inserido com sucesso!",
          id_functionary: result.insertId,
        });
      }
    );
  });
});

router.patch("/", AuthMiddleware.mandatory, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      "UPDATE functionary SET name = ?, wage = ?, Workeddays = ?, street = ?, city = ?, cep = ? WHERE id = ?",
      [
        req.body.name,
        req.body.wage,
        req.body.Workeddays,
        req.body.street,
        req.body.city,
        req.body.cep,
        req.body.id,
      ],

      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(202).send({
          message: "Alteração concluída com sucesso!",
        });
      }
    );
  });
});

router.delete("/:id", AuthMiddleware.mandatory, (req, res, next) => {
  const id = req.params.id;

  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      "DELETE FROM functionary WHERE id = ?",
      id,

      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(202).send({
          message: "Usuário removido com sucesso!",
        });
      }
    );
  });
});

module.exports = router;
