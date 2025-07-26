import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";

export const uploadFileToS3 = async (
  buffer: Buffer,
  originalName: string,
  mimetype: string,
  userId: string
) => {
  const fileExt = mime.extension(mimetype) || "bin";
  const key = `${userId}/${uuidv4()}.${fileExt}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });

  await s3.send(command);  

  return {
    key,
    url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
};

export const deleteFileFromS3 = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  });

  await s3.send(command);
};
