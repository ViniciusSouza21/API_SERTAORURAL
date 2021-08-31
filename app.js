const express = require("express");
const app = express();
const morgan = require("morgan");

app.use('/uploads', express.static('uploads'));

const cors = require("cors");

const routeSales = require("./routes/sale");
const routeUsers = require("./routes/user");
const routeProducts = require("./routes/product");
const routePests = require("./routes/pest");
const routePlantations = require("./routes/plantation");
const routeInputs = require("./routes/input");
const routeinsecticides = require("./routes/insecticide");
const routeFunctionarys = require("./routes/functionary");
const routeSuppliers = require("./routes/supplier");
const routeExpenditures = require("./routes/expenditure");
const routeHarvests = require("./routes/harvest");

const routeSumSalesMonths = require("./routes/sumSalesMonth");
const routeSumExpendituresMonths = require("./routes/sumExpenditureMonth");

const rotaLogin = require("./routes/login");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-Widh, Accept, Authorization, Content-Type"
  );

  if (res.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, DELETE, GET, PATCH, HEAD"
    );
    return res.status(200).send({});
  }

  next();
});

app.use("/sales", routeSales);
app.use("/users", routeUsers);
app.use("/products", routeProducts);
app.use("/pests", routePests);
app.use("/plantations", routePlantations);
app.use("/inputs", routeInputs);
app.use("/insecticides", routeinsecticides);
app.use("/functionarys", routeFunctionarys);
app.use("/suppliers", routeSuppliers);
app.use("/expenditures", routeExpenditures);
app.use("/harvests", routeHarvests);

app.use("/sales/summonths", routeSumSalesMonths);
app.use("/expenditures/summonths", routeSumExpendituresMonths);

app.use("/login", rotaLogin);

app.use((req, res, next) => {
  const erro = new Error("Não encontrado");
  erro.status(404);
  next(erro);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      message: error.message,
    },
  });
});

app.use('/uploads', express.static('./uploads'));

module.exports = app;
