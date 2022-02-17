import * as express from "express";
import { json } from "body-parser";

import {
  deleteDynamoDbItem,
  getDynamoDbItem,
  putDynamoDbItem,
  updateDynamoDbItem,
} from "./dynamodb-item";
import {
  deletePostgresItem,
  getPostgresDbItem,
  createPostgresDbItem,
  updatePostgresItem,
} from "./postgresdb-item";
import {
  deleteItem,
  getItem,
  putItem,
  updateItem,
  listItems,
} from "./local-item";

import { getAll, getOne, createOne, updateOne, deleteOne } from "./local-user";
import sequelize from "./util/database"; // database and sequelize initializations
import User from "./models/users"; // REQUIRED even if your IDE says it’s not used!

// Constants
const PORT = process.env.STAGE === "local" ? 8000 : 80;
const HOST = "0.0.0.0";

// App handlers
const app = express();
const parser = json();

app.get("/", (req: any, res: any) => {
  res.status(200).send("hello world!");
});

app.get("/ping", (req: any, res: any) => {
  res.status(200).send("pong");
});

app.get("/local-item/:id", parser, getItem);
app.get("/local-item", parser, listItems);
app.post("/local-item", parser, putItem);
app.put("/local-item/:id", parser, updateItem);
app.delete("/local-item", parser, deleteItem);

app.put("/dynamodb-item", parser, putDynamoDbItem);
app.post("/dynamodb-item", parser, updateDynamoDbItem);
app.get("/dynamodb-item", parser, getDynamoDbItem);
app.delete("/dynamodb-item", parser, deleteDynamoDbItem);

app.get("/postgres-item/:id", parser, getPostgresDbItem);
app.get("/postgres-item", parser, getPostgresDbItem);
app.post("/postgres-item", parser, createPostgresDbItem);
app.put("/postgres-item/:id", parser, updatePostgresItem);
app.delete("/postgres-item/:id", parser, deletePostgresItem);

app.get("/users", parser, getAll);
app.get("/users/:id", parser, getOne);
app.post("/users", parser, createOne);
app.put("/users/:id", parser, updateOne);
app.delete("/users/:id", parser, deleteOne);

// app.listen(PORT, HOST);
// console.log(`Running on http://${HOST}:${PORT}`);

const start = async () => {
  try {
    await sequelize.sync(
      { force: false } // Reset db every time
    );

    app.listen(PORT, HOST);
    console.log(`Running on http://${HOST}:${PORT}`);
  } catch (error) {
    console.log(error);
  }
};

start();
