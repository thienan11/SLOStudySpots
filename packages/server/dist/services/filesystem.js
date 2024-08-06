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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var filesystem_exports = {};
__export(filesystem_exports, {
  getFile: () => getFile,
  saveFile: () => saveFile
});
module.exports = __toCommonJS(filesystem_exports);
var import_promises = __toESM(require("node:fs/promises"));
var import_node_stream = require("node:stream");
var import_uuid = require("uuid");
var import_study_spot_svc = __toESM(require("../services/study-spot-svc"));
const PHOTOS = process.env.PHOTOS || "/tmp";
function saveFile(req, res) {
  return __async(this, null, function* () {
    const filename = req.query.filename || "upload";
    const studySpotId = req.query.studySpotId;
    const username = req.query.username;
    const uuid = (0, import_uuid.v4)();
    const blobname = `${uuid}:${filename}`;
    const stream = import_node_stream.Readable.from(req.body);
    try {
      const filePath = `${PHOTOS}/${blobname}`;
      yield import_promises.default.writeFile(filePath, yield streamToBuffer(stream));
      const photoUrl = `/photos/${blobname}`;
      console.log(`File saved at: ${filePath}`);
      console.log(`Photo URL: ${photoUrl}`);
      const photoDetails = {
        url: photoUrl,
        uploadedBy: username,
        uploadDate: /* @__PURE__ */ new Date()
      };
      yield import_study_spot_svc.default.updatePhotoUrls(studySpotId, photoDetails);
      res.status(201).send({
        url: photoUrl
      });
    } catch (error) {
      res.status(500).send({
        message: "Failed to upload file to server filesystem",
        error
      });
    }
  });
}
function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
function getFile(req, res) {
  const { id } = req.params;
  import_promises.default.readFile(`${PHOTOS}/${id}`).then((buf) => {
    res.send(buf);
  }).catch((error) => {
    res.status(404).send({
      message: `Not Found: ${id}`,
      error
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getFile,
  saveFile
});
