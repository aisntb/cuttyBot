import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import {pool} from "../database"
import { ResultSetHeader } from 'mysql2';

const s3 = new S3Client({
  region: "ap-northeast-2",                // 하드코딩된 리전
  credentials: {
    accessKeyId: "",    // 필요하면 키도 같이 박아
    secretAccessKey: ""
  }
});

export async function addArchiveImg(userid:string, author:string, imgURL: string, content:string){
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO archive (userid, author, imgUrl, content) VALUES (?, ?, ?, ?)',
        [userid, author, imgURL, content]
    );

    return result.insertId;
}

export async function uploadImg(url: string) {
  // ← 여기 responseType을 'arraybuffer'로!
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data);          // 이제 response.data는 ArrayBuffer
  const contentType = response.headers['content-type'] || 'application/octet-stream';
  const ext = contentType.split('/')[1] || 'bin';
  const key = `${Date.now()}.${ext}`;

  await s3.send(new PutObjectCommand({
    Bucket: "studybot",
    Key: key,
    Body: buffer,                                     // 진짜 Buffer
    ContentType: contentType,
    ContentLength: buffer.length                      // 길이 명시
  }));

  return key
}