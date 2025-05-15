import axios from "axios";
import { MessageEvent } from "../../irisjs/message";
import { ICommand } from "./ICommand";
import { imgURL } from "../../irisjs/util";

function extractJSONFromJSONP(jsonpString:string) {
    const match = jsonpString.match(/getPhoto\((.*)\);?/s); // /s 플래그로 줄바꿈 포함
    if (!match) throw new Error('JSONP 형식 아님');
    return JSON.parse(match[1]);
}

export class ImgSearchCommand implements ICommand{
    async handle(event: MessageEvent): Promise<void> {
        const match = event.msg.match(/^!사진\s+(.+)$/);
        try {
            if (match) {
                const query = match[1];
        
                const res = await axios.get(`https://s.search.naver.com/p/c/image/46/search.naver?display=100&json_type=6&query=${encodeURI(query)}&section=image&where=image&_callback=getPhoto`,{
                    headers:{
                        "Content-Type":"application/json",
                        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
                    }
                })
                let jsonData = extractJSONFromJSONP(res.data);
                jsonData = jsonData.items.map((e:{originalUrl:string})=>e.originalUrl)
                const randomItem = jsonData[Math.floor(Math.random() * jsonData.length)];
                const imgBuffer = await imgURL(randomItem)
                event.replyImage(imgBuffer)
            }
            
        } catch (error) {
            event.replyText('이미지를 가져오던 중 오류가 발생했습니다.')           
        }
        
        
    }
    help: string | null = "사진 <검색어>로 사진을 검색한 뒤 채팅방으로 전송합니다.";
    invoke: string = "사진";
    
}