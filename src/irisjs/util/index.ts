import axios from "axios";

export function bufferToBase64(buffer:Buffer) {
    const bufferData = Buffer.from(buffer);
    const base64 = bufferData.toString('base64');
    return base64
  }
  
  export function safeParseBigIntJSON(jsonStr:string) {
  // src_logId, src_userId, 등 큰 숫자 필드를 문자열로 바꿔줌
  return JSON.parse(
    jsonStr.replace(/:\s?(\d{16,})/g, ': "$1"')
  );
}

export async function imgURL(url:string) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
}
