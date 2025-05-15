import { bot } from "../..";
import { MessageEvent } from "../../irisjs/message";
import { imgURL, safeParseBigIntJSON } from "../../irisjs/util";
import { ICommand } from "./ICommand";

export class ProfileImageCommand implements ICommand{
    help: string | null = "프로필 사진을 가져오고 싶은 유저의 메세지에 답장을 하면 해당 유저의 프로필 이미지가 전송됩니다. 답장 없이 사용시 본인의 프사가 전송됩니다.";
    async handle(event: MessageEvent): Promise<void> {
        try{
            const attachment = safeParseBigIntJSON(event.json.attachment)
            const userid = attachment.src_userId || event.json.user_id
            const user = await bot.query('SELECT * FROM open_chat_member WHERE user_id=?',[String(userid)])
            const profileURL = await imgURL(user.data[0].original_profile_image_url)
            event.replyImage(profileURL)
        }catch(e){
            event.replyText("이미지를 가져오던 중 오류가 발생했습니다.")
        }
    }
    invoke: string = 'ps';
    
}