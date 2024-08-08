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
var cloud_storage_exports = {};
__export(cloud_storage_exports, {
  getFile: () => getFile,
  saveFile: () => saveFile
});
module.exports = __toCommonJS(cloud_storage_exports);
var import_node_stream = require("node:stream");
var import_uuid = require("uuid");
var import_storage = require("@google-cloud/storage");
var import_study_spot_svc = __toESM(require("./study-spot-svc"));
const storage = new import_storage.Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GCS_KEY_FILE
});
const bucketName = process.env.GCS_BUCKET_NAME || "your-bucket-name";
const bucket = storage.bucket(bucketName);
function saveFile(req, res) {
  return __async(this, null, function* () {
    const filename = req.query.filename || "upload";
    const studySpotId = req.query.studySpotId;
    const username = req.query.username;
    const uuid = (0, import_uuid.v4)();
    const blobname = `${uuid}:${filename}`;
    const stream = import_node_stream.Readable.from(req.body);
    try {
      const file = bucket.file(blobname);
      const writeStream = file.createWriteStream({
        metadata: {
          contentType: req.headers["content-type"]
        }
      });
      stream.pipe(writeStream);
      yield new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });
      const photoUrl = `https://storage.googleapis.com/${bucketName}/${blobname}`;
      console.log(`File saved to Google Cloud Storage: ${photoUrl}`);
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
        message: "Failed to upload file to Google Cloud Storage",
        error
      });
    }
  });
}
function getFile(req, res) {
  return __async(this, null, function* () {
    const { id } = req.params;
    const file = bucket.file(id);
    try {
      const [exists] = yield file.exists();
      if (!exists) {
        throw new Error("File not found");
      }
      const readStream = file.createReadStream();
      readStream.pipe(res);
    } catch (error) {
      res.status(404).send({
        message: `Not Found: ${id}`,
        error
      });
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getFile,
  saveFile
});
