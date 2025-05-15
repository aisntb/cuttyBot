import axios from "axios";
import { MessageEvent } from "../../irisjs/message";
import { ICommand } from "./ICommand";
import { searchCafeUser } from "../../util/CafeSearch";

export class CafeUserCommand implements ICommand{
    async handle(event: MessageEvent): Promise<void> {
        let match = event.msg.match(/!카페\s+([\s\S]+)/);
        if(!match) return event.replyText('!카페 <유저아이디> 형태로 입력해주세요.')
        const keyword = match[1]
        const userid = await searchCafeUser(keyword)
        console.log(userid)
    }
    help: string | null = "!카페 <유저아이디> 로 카봇커 카페에서 유저검색을 합니다.";
    invoke: string = "카페";
    
}