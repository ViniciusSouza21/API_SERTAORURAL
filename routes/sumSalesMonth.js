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
      "SELECT date, value FROM sales WHERE user = ?;",
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

        arraySales = {};

        for (let i = 0; i < result.length; i++) {
          let DateObj = new Date(result[i].date);
          let saleValue = result[i].value;

          let months = DateObj.getMonth();
          let year = DateObj.getFullYear();

          if (months === 0) {
            sumJan += saleValue;
          }

          else if (months === 1) {
            sumFeb += saleValue;
          }

          else if (months === 2) {
            sumMar += saleValue;
          }

          else if (months === 3) {
            sumApr += saleValue;
          }

          else if (months === 4) {
            sumMay += saleValue;
          }

          else if (months === 5) {
            sumJun += saleValue;
          }

          else if (months === 6) {
            sumJul += saleValue;
          }

          else if (months === 7) {
            sumAug += saleValue;
          }

          else if (months === 8) {
            sumSep += saleValue;
          }

          else if (months === 9) {
            sumOct += saleValue;
          }

          else if (months === 10) {
            sumNov += saleValue;
          }

          else if (months === 11) {
            sumDec += saleValue;
          }
        }

        arraySales = {
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
          sum_sales_month: arraySales,
        });
      }
    );
  });
});

module.exports = router;