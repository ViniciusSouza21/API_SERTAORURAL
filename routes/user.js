const express = require("express");
const app = require("../app");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, calback) {
    calback(null, "./uploads/");
  },
  filename: function (req, file, calback) {
    calback(null, file.originalname);
  },
});

const fileFilter = (req, file, calback) => {
  if (file.mimeType === "image/jpeg" || file.mimeType === "image/png") {
    calback(null, true);
  } else {
    calback(null, false);
  }
};

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 10,
  // },
  // fileFilter: fileFilter
});

router.get("/:id", AuthMiddleware.mandatory, (req, res, next) => {
  const id = req.params.id;

  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      "SELECT * FROM user WHERE id = ?;",
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

router.get("/", AuthMiddleware.mandatory, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      "SELECT * FROM user;",
      [req.body.id],

      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        return res.status(200).send({ response: result });
      }
    );
  });
});

router.post("/", upload.single("profile"), (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      "SELECT * FROM user WHERE email = ?",
      [req.body.email],
      (error, results) => {
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }

        if (results.length > 0) {
          res.status(401).send({
            message: "E-mail já cadastrado!",
          });
        } else {
          bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt });
            }

            conn.query(
              "INSERT INTO user (admin, cpf, name, surname, email, password, active, street, neighborhood, city, cep, profile) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                req.body.admin,
                req.body.cpf,
                req.body.name,
                req.body.surname,
                req.body.email,
                hash,
                req.body.active,
                req.body.street,
                req.body.neighborhood,
                req.body.city,
                req.body.cep,
                req.file.path,
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
                  message: "Usuário inserido com sucesso!",
                  id_user: result.insertId,
                  image_user: req.file.path,
                });
              }
            );
          });
        }
      }
    );
  });
});

router.put("/", AuthMiddleware.mandatory, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      "UPDATE user SET admin = ?, cpf = ?, name = ?, surname = ?, email = ?, password = ?, active = ?, street = ?, neighborhood = ?, city = ?, cep = ? WHERE id = ?",
      [
        req.body.admin,
        req.body.cpf,
        req.body.name,
        req.body.surname,
        req.body.email,
        req.body.password,
        req.body.active,
        req.body.street,
        req.body.neighborhood,
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

router.patch("/personal", AuthMiddleware.mandatory, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      "UPDATE user SET cpf = ?, name = ?, surname = ? WHERE id = ?",
      [req.body.cpf, req.body.name, req.body.surname, req.body.id],

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

router.patch(
  "/photo",
  upload.single("profile"),
  AuthMiddleware.mandatory,
  (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }

      conn.query(
        "UPDATE user SET profile = ? WHERE id = ?",
        [req.file.path, req.body.id],

        (error, result, field) => {
          conn.release();

          if (error) {
            return res.status(500).send({
              error: error,
              response: null,
            });
          }
          res.status(202).send({
            message: "Foto de perfil alterada com sucesso!",
          });
        }
      );
    });
  }
);

router.patch("/address", AuthMiddleware.mandatory, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      "UPDATE user SET street = ?, neighborhood = ?, city = ?, cep = ? WHERE id = ?",
      [
        req.body.street,
        req.body.neighborhood,
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

router.patch("/password/:id", AuthMiddleware.mandatory, (req, res, next) => {
  const id = req.params.id;
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    const query = "SELECT * FROM user WHERE id = ?";

    conn.query(query, [id], (error, results, fields) => {
      conn.release();

      if (error) {
        return res.status(500).send({ error: error });
      }

      if (results.length < 1) {
        return res.status(401).send({ message: "Informe sua antiga senha." });
      }

      bcrypt.compare(req.body.oldPassword, results[0].password, (err, result) => {
        const pass = bcrypt.compare(req.body.oldPassword, results[0].password);

        if (err) {
          return res.status(401).send({ message: "Falha na autenticação!" });
        }

        if (result) {

          conn.query(
            "UPDATE user SET password = ? WHERE id = ?",
            [
              req.body.newPassword,
              id,
            ],
          );

          return res.status(200).send({
            message: "Senha alterada com sucesso!",
          });
        }

        return res.status(401).send({ 
          valid: false,
          message: "Senha inválida!" 
        });
      });
    });
  });

});

router.delete("/:id", AuthMiddleware.mandatory, (req, res, next) => {
  const id = req.params.id;

  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      "DELETE FROM user WHERE id = ?",
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
