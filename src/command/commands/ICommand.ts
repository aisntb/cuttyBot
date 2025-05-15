import { MessageEvent } from "../../irisjs/message";

export interface ICommand {
    handle(event: MessageEvent):void;
    help: string | null;
    invoke: string;
}