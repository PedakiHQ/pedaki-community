import type {FileUpload, FileUploadResult} from '~/files/file.model.ts';
import type {Storage} from './storage.ts';
import {prepareFile} from "~/files/storage/utils.ts";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import {env} from "~/env.ts";
import {s3Client} from "~/utils/aws.ts";
export class S3Storage implements Storage {
    async uploadFile(rawFile: FileUpload): Promise<FileUploadResult> {
        const file = prepareFile(rawFile);

        const bucket = file.availability === 'public' ? env.FILE_STORAGE_S3_PUBLIC_BUCKET : env.FILE_STORAGE_S3_PRIVATE_BUCKET;
        const key = `${env.FILE_STORAGE_S3_PREFIX}/${file.path}${file.name}.${file.extension}`;

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimeType,
            ContentLength: file.size,
        });

        await s3Client!.send(command);

        return {
            name: file.name,
            mimeType: file.mimeType,
            size: file.size,
            altUrl: `https://s3.${env.FILE_STORAGE_S3_REGION}.amazonaws.com/${bucket}/${key}`,
            url: `https://${bucket}/${key}`,
            availability: file.availability,
        };
    }
}

const s3Storage = new S3Storage();
export {s3Storage};
