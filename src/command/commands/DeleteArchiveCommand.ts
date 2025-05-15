import { bot } from "../..";
import { MessageEvent } from "../../irisjs/message";
import { safeParseBigIntJSON } from "../../irisjs/util";
import { ICommand } from "./ICommand";

export class AddArchiveCommand implements ICommand{
    async handle(event: MessageEvent) {
        
    }
    help: string | null = "아카이브삭제 <게시물 아이디>로 내 아카이브의 게시물을 삭제합니다.";
    invoke: string = "아카이브브";
    
}