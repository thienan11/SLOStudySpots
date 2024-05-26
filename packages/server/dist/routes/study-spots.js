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
var study_spots_exports = {};
__export(study_spots_exports, {
  default: () => study_spots_default
});
module.exports = __toCommonJS(study_spots_exports);
var import_express = __toESM(require("express"));
var import_study_spot_svc = __toESM(require("../services/study-spot-svc"));
const router = import_express.default.Router();
router.get("/:id", (req, res) => {
  const id = req.params.id;
  import_study_spot_svc.default.getStudySpotbyId(id).then((studySpot) => {
    if (studySpot) {
      res.json(studySpot);
    } else {
      res.status(404).send("Study spot not found!");
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});
router.post("/", (req, res) => {
  const newStudySpot = req.body;
  import_study_spot_svc.default.create(newStudySpot).then((studySpot) => {
    res.status(201).send(studySpot);
  }).catch((err) => {
    res.status(500).send(err);
  });
});
var study_spots_default = router;
