import { MessageEvent } from "../irisjs/message"
import { AddArchiveCommand } from "./commands/AddArchiveCommand"
import { CafeUserCommand } from "./commands/CafeUserCommand"
import { EvalCommand } from "./commands/EvalCommand"
import { ICommand } from "./commands/ICommand"
import { ImgSearchCommand } from "./commands/ImageSearchCommand"
import { KermitCommand } from "./commands/KermitCommand"
import { ProfileImageCommand } from "./commands/ProfileImageCommand"
import { ServerInfoCommand } from "./commands/ServerInfoCommand"
import { WhoIsCommand } from "./commands/WhoisCommand"

export class CommandManager{
    exactCommands:Map<string, ICommand>
    constructor(){
        this.exactCommands = new Map()
        console.log('Loading commands...')
        this.addCommand(new AddArchiveCommand())
        this.addCommand(new WhoIsCommand())
        this.addCommand(new EvalCommand())
        this.addCommand(new ImgSearchCommand())
        this.addCommand(new ProfileImageCommand())
        this.addCommand(new KermitCommand())
        this.addCommand(new ServerInfoCommand())
    }
    addCommand(command:ICommand){
        this.exactCommands?.set(command.invoke, command)
        console.log(`☀️ 명령어 등록: ${command.invoke}`)
    }
    handleCommand(event: MessageEvent) {
        console.log(`[메세지] ${event.sender}: ${event.msg}`)
        const prefix = "!"
        if (!event.msg.startsWith(prefix)) return
        if(event.msg == '!도움말'){
            const result = Array.from(this.exactCommands.values())
            .map(cmd => '!'+cmd.invoke + '\n' +cmd.help)
            .join("\n\n");
            event.replyText(result)
        }

        const content = event.msg.slice(1)
        const split = content.split(/\s+/);
        const invoke = split[0]

        this.exactCommands?.get(invoke)?.handle(event)
    }
}