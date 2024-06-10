"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var reviews_exports = {};
__export(reviews_exports, {
  default: () => reviews_default
});
module.exports = __toCommonJS(reviews_exports);
var import_express = __toESM(require("express"));
var import_review_svc = __toESM(require("../services/review-svc"));
const router = import_express.default.Router();
router.get("/", (req, res) => {
  import_review_svc.default.index().then(
    (list) => res.status(200).send({
      count: list.length,
      data: list
    })
  ).catch((err) => res.status(500).send(err));
});
router.get("/:id", (req, res) => {
  const id = req.params.id;
  import_review_svc.default.getReviewById(id).then((review) => {
    if (review) {
      res.json(review);
    } else {
      res.status(404).send("Review not found!");
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});
router.post("/", (req, res) => {
  const newReview = req.body;
  import_review_svc.default.create(newReview).then((review) => {
    res.status(201).send(review);
  }).catch((err) => {
    res.status(500).send(err);
  });
});
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatedReview = req.body;
  import_review_svc.default.update(id, updatedReview).then((review) => {
    if (review) {
      res.json(review);
    } else {
      res.status(404).send("Review not found!");
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});
router.get("/spot/:spotid", (req, res) => {
  const spotId = req.params.spotid;
  import_review_svc.default.getReviewsBySpotId(spotId).then((reviews2) => {
    if (reviews2.length > 0) {
      res.json(reviews2);
    } else {
      res.status(404).send("No reviews found for this study spot.");
    }
  }).catch((error) => {
    res.status(500).send(error.message);
  });
});
router.get("/user/:userid", (req, res) => {
  const userId = req.params.userid;
  import_review_svc.default.getReviewsByUserId(userId).then((reviews2) => {
    if (reviews2) {
      res.json(reviews2);
    } else {
      res.status(404).send("No reviews found for this user!");
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  import_review_svc.default.deleteReviewById(id).then((review) => {
    if (review) {
      res.status(200).send({ message: "Review deleted successfully" });
    } else {
      res.status(404).send("Review not found!");
    }
  }).catch((error) => {
    res.status(500).send(error.message);
  });
});
var reviews_default = router;
