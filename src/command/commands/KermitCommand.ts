import axios from "axios";
import { MessageEvent } from "../../irisjs/message";
import { ICommand } from "./ICommand";
import { imgURL } from "../../irisjs/util";

function extractJSONFromJSONP(jsonpString:string) {
    const match = jsonpString.match(/getPhoto\((.*)\);?/s); // /s 플래그로 줄바꿈 포함
    if (!match) throw new Error('JSONP 형식 아님');
    return JSON.parse(match[1]);
}


export class KermitCommand implements ICommand{
    async handle(event: MessageEvent): Promise<void> {
        try {
            const res = await axios.get("https://s.search.naver.com/p/c/image/46/search.naver?display=100&json_type=6&query=커밋개구리짤&section=image&where=image&_callback=getPhoto",{
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
        } catch (error) {
            event.replyText("커밋짤을 가져오던 중 에러가 발생했습니다.\n"+error)
        }
        
    }
    help: string | null = "랜덤 커밋짤을 가져와 채팅방에 전송합니다.";
    invoke: string = "커밋";
    
}