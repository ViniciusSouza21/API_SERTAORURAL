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
      "SELECT date, value FROM expenditure WHERE user = ?;",
      id,

      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        monthsT = [
            sumJan =
            sumFeb =
            sumMar =
            sumApr =
            sumMay =
            sumJun =
            sumJul =
            sumAug =
            sumSep =
            sumOct =
            sumNov =
            sumDec =
              0
            ];

        arrayexpenditure = {};

        for (let i = 0; i < result.length; i++) {
          let DateObj = new Date(result[i].date);
          let saleValue = result[i].value;

          let months = DateObj.getMonth();
          let year = DateObj.getFullYear();

          if (months === 0) {
            sumJan += saleValue;
          }

          if (months === 1) {
            sumFeb += saleValue;
          }

          if (months === 2) {
            sumMar += saleValue;
          }

          if (months === 3) {
            sumApr += saleValue;
          }

          if (months === 4) {
            sumMay += saleValue;
          }

          if (months === 5) {
            sumJun += saleValue;
          }

          if (months === 6) {
            sumJul += saleValue;
          }

          if (months === 7) {
            sumAug += saleValue;
          }

          if (months === 8) {
            sumSep += saleValue;
          }

          if (months === 9) {
            sumOct += saleValue;
          }

          if (months === 10) {
            sumNov += saleValue;
          }

          if (months === 11) {
            sumDec += saleValue;
          }
        }

        arrayexpenditure = {
          "Jan": sumJan,
          "Feb": sumFeb,
          "Mar": sumMar,
          "Apr": sumApr,
          "May": sumMay,
          "Jun": sumJun,
          "Jul": sumJul,
          "Aug": sumAug,
          "Sep": sumSep,
          "Oct": sumOct,
          "Nov": sumNov,
          "Dec": sumDec,
      };

        return res.status(200).send({
          sum_expenditure_month: arrayexpenditure,
        });
      }
    );
  });
});

module.exports = router;