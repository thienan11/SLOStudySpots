import { Request, Response } from "express";
import fs from "node:fs/promises";
import { Readable } from "node:stream";
import { v4 as uuidv4 } from "uuid";
import studySpots from "../services/study-spot-svc";

const PHOTOS = process.env.PHOTOS || "/tmp";

export async function saveFile(req: Request, res: Response) {
  const filename = (req.query.filename as string) || "upload";
  const studySpotId = req.query.studySpotId as string;
  const username = req.query.username as string; // Assuming user info is added to the request by an authentication middleware
  const uuid = uuidv4();
  const blobname = `${uuid}:${filename}`;
  const stream = Readable.from(req.body);

  try {
    const filePath = `${PHOTOS}/${blobname}`;
    await fs.writeFile(filePath, await streamToBuffer(stream));
    const photoUrl = `/photos/${blobname}`;

    console.log(`File saved at: ${filePath}`);
    console.log(`Photo URL: ${photoUrl}`);

    const photoDetails = {
      url: photoUrl,
      uploadedBy: username,
      uploadDate: new Date()
    };

    await studySpots.updatePhotoUrls(studySpotId, photoDetails);

    res.status(201).send({
      url: photoUrl
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to upload file to server filesystem",
      error
    });
  }
}

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export function getFile(req: Request, res: Response) {
  const { id } = req.params;

  fs.readFile(`${PHOTOS}/${id}`)
    .then((buf) => {
      res.send(buf);
    })
    .catch((error: Error) => {
      res.status(404).send({
        message: `Not Found: ${id}`,
        error
      });
    });
}