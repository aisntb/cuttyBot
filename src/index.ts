import { CommandManager } from "./command/CommandManager";
import { Bot } from "./irisjs/index";
import { MessageEvent } from './irisjs/message';

export const bot = new Bot('140.238.8.198:3000');

// 'message' 이벤트 리스닝
const CMDManager = new CommandManager()

bot.on('message', (event:MessageEvent) => {
    if(event.msg == '!와') event.replyText('sanss')
    CMDManager.handleCommand(event)
});

bot.on('connect',() => {
    console.log("웹소켓에 연결되었습니다.")
})

bot.on('disconnect',() => {
    console.log("웹소켓 연결이 끊어졌습니다.")
})

bot.on('error',(error:Event) => {
    console.log("에러가 발생했습니다.", error)
})
bot.connect();

