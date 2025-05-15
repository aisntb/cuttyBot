import { bot } from "../..";
import { MessageEvent } from "../../irisjs/message";
import { safeParseBigIntJSON } from "../../irisjs/util";
import { ImgSearchByLink } from "../../util/ImgSearch";
import { ICommand } from "./ICommand";
import OpenAI from "openai";


export class WhoIsCommand implements ICommand{
    async handle(event: MessageEvent): Promise<void> {        
        try{
            const attachment = safeParseBigIntJSON(event.json.attachment)
            const original = await bot.query("SELECT * FROM chat_logs WHERE id = ?", [String(attachment.src_logId)])
            const originalMsg = original.data[0].message
            console.log(originalMsg)
            if(attachment.src_message != "사진" &&  !/^사진 \d+장$/.test(originalMsg) && attachment.src_message != "사진 n장") return event.replyText("이미지에 답장을 통해 사용해주세요.")
            
            if(original.data[0].message == '사진 n장'){
                const image = JSON.parse(original.data[0]?.attachment)
                const result:{result:string[], related: string[]} = await ImgSearchByLink(image.imageUrls[0])
                if(!result) return event.replyText('이미지 검색 중 에러가 발생했습니다.')
                if(!result.result[0]&&!result.related[0]) return event.replyText('이미지 검색결과가 없습니다.')
                const freq = frequency(result.result).slice(0,5).map(e=>'#'+e.word)
                event.replyText(
                    '🔎 이미지 검색 결과\n'+
                    `이 사진은 **${result.related[0] || result.result[0]}** 관련 이미지 같습니다.\n\n`+
                    `${result.related[0]?`관련검색어: ${result.related.join(', ')}\n`:''}\n`+
                    freq.join(', ')
                )
                return
            }
            const image = JSON.parse(original.data[0]?.attachment)
            const result:{result:string[], related: string[]} = await ImgSearchByLink(image.url)
            if(!result) return event.replyText('이미지 검색 중 에러가 발생했습니다.')
            if(!result.result[0]&&!result.related[0]) return event.replyText('이미지 검색결과가 없습니다.')
            const freq = frequency(result.result).slice(0,5).map(e=>'#'+e.word)
            
            event.replyText(
                '🔎 이미지 검색 결과\n'+
                `이 사진은 **${result.related[0] || result.result[0]}** 관련 이미지 같습니다.\n\n`+
                `${result.related[0]?`관련검색어: ${result.related.join(', ')}\n`:''}\n`+
                freq.join(', ')
            )
           /*event.replyText(
            `이 사진은 **${result.related[0]}** 관련 이미지 같습니다.\n`+
            `${result.related[0]?`관련검색어: ${result.related.join(', ')}\n`:''}`*/
        
        }catch(e){
            event.replyText("이미지에 답장을 통해 사용해주세요.")
            console.log(e)
        }
        
        
    }
    help: string | null = "구글 이미지 렌즈를 통해 비슷한 이미지를 검색합니다.";
    invoke: string = '후왓';
    
}

const frequency = (searchResults: string[]) =>{
    const text = searchResults.join(" ");
    // 한글 단어만 뽑아내기 (정규식으로)
    const words = text.match(/[가-힣]{2,}/g) || [];

    // 빈도수 객체 생성
    const freq = {};
    for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
    }

    // 정렬
    const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])  // 빈도 높은 순
    .map(([word, count]) => ({ word, count }));

    console.log(sorted);
    return sorted
}
