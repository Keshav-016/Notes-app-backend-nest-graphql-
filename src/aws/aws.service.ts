import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import CustomError from 'src/filters/custom-error-filter';
import { StatusCodes } from 'src/enum/status-codes.enum';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
@Injectable()
export class AwsService {
  private s3Client: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCEESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCEESS_KEY'),
      },
    });
  }

  async uploadFile(file) {
    try {
      const fileName = file.filename.replace(/[^\w.](?=.*\.)/g, '_');

      const key = `${Date.now().toString()}-${fileName.trim()}`;

      const buffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks = [];
        file
          .createReadStream()
          .on('data', (chunk) => chunks.push(chunk))
          .on('end', () => resolve(Buffer.concat(chunks)))
          .on('error', reject);
      });

      const putObjectCommand = new PutObjectCommand({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
        Key: key,
        Body: buffer,
        ContentType: file.mimetype,
      });

      const res = await this.s3Client.send(putObjectCommand);

      if (res.$metadata.httpStatusCode === 200) {
        const url = key;
        return url;
      } else {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'Error in file upload');
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchSignedUrl(fileName: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
        Key: fileName,
      });

      const response = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deletefile(fileName: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
        Key: fileName,
      });
      const res = await this.s3Client.send(command);
      return res;
    } catch (error) {
      throw error;
    }
  }
}
