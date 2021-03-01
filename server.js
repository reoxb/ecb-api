require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const InventoryItem = require("./data/InventoryItem");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api/inventory", async (req, res) => {
  try {
    const inventoryItems = await InventoryItem.find();
    res.json(inventoryItems);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

app.get("/api/inventory/:id", async (req, res) => {
  try {
    const selectedItem = await InventoryItem.findById(req.params.id);
    res.json(selectedItem);
  } catch (err) {
    return res.status(400).json({
      message: "There was a problem selecting the item.",
    });
  }
});

app.post("/api/inventory", async (req, res) => {
  try {
    const inventoryItem = new InventoryItem(req.body);
    await inventoryItem.save();
    res.status(201).json({
      message: "Inventory item created!",
      inventoryItem,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "There was a problem creating the item",
    });
  }
});

app.delete("/api/inventory/:id", async (req, res) => {
  try {
    const deletedItem = await InventoryItem.findOneAndDelete({
      _id: req.params.id,
    });
    res.status(201).json({
      message: "Inventory item deleted!",
      deletedItem,
    });
  } catch (err) {
    return res.status(400).json({
      message: "There was a problem deleting the item.",
    });
  }
});

async function connect() {
  try {
    mongoose.Promise = global.Promise;
    await mongoose.connect(process.env.ATLAS_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  } catch (err) {
    console.log("Mongoose error", err);
  }
  app.listen(3001);
  console.log("API listening on localhost:3001");
}

connect();
