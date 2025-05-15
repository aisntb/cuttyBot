import { MessageEvent } from "../../irisjs/message";
import { ICommand } from "./ICommand";
import { bot } from "../..";
import { imgURL, safeParseBigIntJSON } from "../../irisjs/util";

export class EvalCommand implements ICommand{
    async handle(event: MessageEvent): Promise<void> {
        try {
            if(event.json.user_id != '7831346840253704798') return;
            const msg = event.msg
            const match = msg.match(/!eval\s+([\s\S]+)/);
            const Bot = bot
            var SafeParseBigIntJSON = safeParseBigIntJSON
            const URL = imgURL
            if (match) {
                const code = match[1];
                try {
                    const result = eval(code);
                    event.replyText("결과:\n"+ String(result));
                } catch (e) {
                    event.replyText("에러:\n"+e);
                }
            }            
        } catch (error) {
            event.replyText('⚠️에러발생\n'+error)
        }
    }
    help: string | null="제한된 명령어로 관리자만 사용가능합니다.";
    invoke: string="eval";
}