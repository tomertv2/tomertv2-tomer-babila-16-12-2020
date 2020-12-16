const { Router } = require('express');
const db = require('../../database/database');
const { nanoid } = require('nanoid');

const router = Router();

// GET all items from database
router.get('/', (req, res) => {
  try {
    const allItems = db.get('itemList').value();
    res.send(allItems);
  } catch (error) {
    console.log(error);
  }
});

// POST a new item
router.post('/', (req, res) => {
  try {
    const newItem = req.body;
    const newItemStore = newItem.store;
    delete newItem.store;
    const allStores = db.get('itemList').map('store').value();
    if (allStores.includes(newItemStore)) {
      db.get('itemList')
        .find({ store: newItemStore })
        .get('items')
        .push({ id: nanoid(), ...newItem })
        .write();
    } else {
      db.get('itemList')
        .push({ store: newItemStore, items: [{ id: nanoid(), ...newItem }] })
        .write();
    }
    console.log(newItem);
    res.send(newItem);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;