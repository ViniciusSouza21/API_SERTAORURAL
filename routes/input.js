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
      "SELECT * FROM inputs WHERE user = ?;",
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
      "INSERT INTO inputs (user, stock, value, description, purchase, validity, unit) VALUES (?,?,?,?,?,?,?)",
      [
        req.body.user,
        req.body.stock,
        req.body.value,
        req.body.description,
        req.body.purchase,
        req.body.validity,
        req.body.unit,
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
          message: "Insumo inserido com sucesso!",
          id_insumo: result.insertId,
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
      "UPDATE inputs SET stock = ?, value = ?, description = ?, purchase = ?, validity = ?, unit = ? WHERE id = ?",
      [
        req.body.stock,
        req.body.value,
        req.body.description,
        req.body.purchase,
        req.body.validity,
        req.body.unit,
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
      "DELETE FROM inputs WHERE id = ?",
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
          message: "Insumo removido com sucesso!",
        });
      }
    );
  });
});

module.exports = router;
