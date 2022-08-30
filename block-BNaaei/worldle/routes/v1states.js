const express = require("express");
const State = require("../models/State");
const Country = require("../models/Country");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    let sortby;
    const { sortingOrder, sortByPopulation } = req.query;
    if (sortingOrder) {
      sortby = { name: sortingOrder };
    } else if (sortByPopulation) {
      sortby = { population: sortByPopulation };
    } else {
      sortby = {};
    }
    const state = await State.find({}).sort(sortby);
    res.status(200).json(state);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const state = await State.findByIdAndUpdate(id, req.body);
    res.json(state);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id/neighbours", async (req, res, next) => {
  try {
    const id = req.params.id;
    const state = await State.findById(id);
    const neighbouring_states = await state.populate("neighbouring_states");
    res.json(neighbouring_states.neighbouring_states);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const state = await State.findByIdAndDelete(id);
    const country = await Country.findByIdAndUpdate(state.country, {
      $pull: { states: state.id },
    });
    const states = await State.find({ neighbouring_states: id });
    const statesPromises = [];
    states.forEach((stateUpdate) => {
      statesPromises.push(
        State.findByIdAndUpdate(stateUpdate.id, {
          $pull: { neighbouring_states: state.id },
        })
      );
    });
    const updatedStates = await Promise.all(statesPromises);
    res.json(state);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
