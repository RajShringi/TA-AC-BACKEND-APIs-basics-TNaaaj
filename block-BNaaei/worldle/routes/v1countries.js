const express = require("express");
const router = express.Router();
const Country = require("../models/Country");
const State = require("../models/State");

router.post("/", async (req, res, next) => {
  try {
    const country = await Country.create(req.body);
    res.status(200).json(country);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { sortingOrder, ethnicity, continent, sortByPopulation } = req.query;
    let filter, sortby;
    if (sortingOrder) {
      filter = {};
      sortby = { name: sortingOrder };
    } else if (ethnicity) {
      filter = { ethnicity };
    } else if (continent) {
      filter = { continent };
    } else if (sortByPopulation) {
      filter = {};
      sortby = { population: sortByPopulation };
    } else {
      filter = {};
    }
    const countries = await Country.find(filter).sort(sortby);
    res.status(200).json(countries);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { stateSortingOrder } = req.query;
    const id = req.params.id;
    if (stateSortingOrder) {
      const states = await State.find({ country: id }).sort({
        name: stateSortingOrder,
      });
      res.json(states);
    } else {
      const country = await Country.findById(id);
      res.status(200).json(country);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id/neighbours", async (req, res, next) => {
  try {
    const id = req.params.id;
    const country = await Country.findById(id);
    const neighbouring_countires = await country.populate(
      "neighbouring_countires"
    );
    res.json(neighbouring_countires.neighbouring_countires);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const country = await Country.findByIdAndUpdate(id, req.body);
    res.status(200).json(country);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const country = await Country.findByIdAndDelete(id);
    const states = await State.deleteMany({ country: country.id });
    const countries = await Country.find({
      neighbouring_countires: country.id,
    });
    const countriesPromises = [];
    countries.forEach((countryUpdate) => {
      countriesPromises.push(
        Country.findByIdAndUpdate(countryUpdate.id, {
          $pull: { neighbouring_countires: country.id },
        })
      );
    });
    const updatedCountries = await Promise.all(countriesPromises);
    res.status(200).json(country);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/:id/states", async (req, res, next) => {
  try {
    req.body.country = req.params.id;
    const state = await State.create(req.body);
    const country = await Country.findByIdAndUpdate(req.params.id, {
      $push: { states: state.id },
    });
    res.status(200).json(state);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/ethnicity", async (req, res, next) => {
  try {
    const ethnicities = await Country.distinct("ethnicity");
    res.json(ethnicities);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
