import { bot } from "../..";
import { MessageEvent } from "../../irisjs/message";
import { safeParseBigIntJSON } from "../../irisjs/util";
import { addArchiveImg, uploadImg } from "../../util/ArchiveImg";
import { ICommand } from "./ICommand";

export class AddArchiveCommand implements ICommand{
    async handle(event: MessageEvent) {
        const attachment = safeParseBigIntJSON(event.json.attachment)
        const original = await bot.query("SELECT * FROM chat_logs WHERE id = ?", [String(attachment.src_logId)])
        const image = JSON.parse(original.data[0]?.attachment)
        const res = await uploadImg(image.url)
        const imgData = await addArchiveImg(event.json.user_id, event.sender, res, event.room+"에서 아카이브 된 사진입니다.")
        event.replyText(event.sender+'님의 사진이 다음 주소로 아카이브 되었습니다.\n'+imgData)     
    }
    help: string | null = "아카이브에 사진을 추가하는 명령어입니다.";
    invoke: string = "아카이브";
    
}