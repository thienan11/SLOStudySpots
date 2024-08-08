import { Request, Response } from "express";
import { Readable } from "node:stream";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "@google-cloud/storage";
import studySpots from "./study-spot-svc";

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GCS_KEY_FILE,
});
const bucketName = process.env.GCS_BUCKET_NAME || "your-bucket-name";
const bucket = storage.bucket(bucketName);

export async function saveFile(req: Request, res: Response) {
  const filename = (req.query.filename as string) || "upload";
  const studySpotId = req.query.studySpotId as string;
  const username = req.query.username as string; // Assuming user info is added to the request by an authentication middleware
  const uuid = uuidv4();
  const blobname = `${uuid}:${filename}`;
  const stream = Readable.from(req.body);

  try {
    const file = bucket.file(blobname);
    const writeStream = file.createWriteStream({
      metadata: {
        contentType: req.headers["content-type"],
      },
    });

    stream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    const photoUrl = `https://storage.googleapis.com/${bucketName}/${blobname}`;

    console.log(`File saved to Google Cloud Storage: ${photoUrl}`);

    const photoDetails = {
      url: photoUrl,
      uploadedBy: username,
      uploadDate: new Date(),
    };

    await studySpots.updatePhotoUrls(studySpotId, photoDetails);

    res.status(201).send({
      url: photoUrl,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to upload file to Google Cloud Storage",
      error,
    });
  }
}

export async function getFile(req: Request, res: Response) {
  const { id } = req.params;
  const file = bucket.file(id);

  try {
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("File not found");
    }

    const readStream = file.createReadStream();
    readStream.pipe(res);
  } catch (error) {
    res.status(404).send({
      message: `Not Found: ${id}`,
      error,
    });
  }
}
