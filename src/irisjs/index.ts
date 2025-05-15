import { EventEmitter } from 'events';
import { MessageEvent, IMessageEvent } from './message';

export class Bot extends EventEmitter {
    botIP: string;
    ws: WebSocket | null;

    constructor(botUrl: string) {
        super(); // EventEmitter를 상속받기 위해 super() 호출
        this.botIP = botUrl;  // botUrl을 botIP에 할당
        this.ws = null;
    }

    // 웹소켓 연결
    connect() {
        this.ws = new WebSocket(`ws://${this.botIP}/ws`);

        // 연결 성공 시
        this.ws.onopen = () => {
            this.emit('connect')
        };

        // 메시지 수신 시
        this.ws.onmessage = (event) => {
            const data:IMessageEvent = JSON.parse(event.data);
            const enrichedEvent = new MessageEvent(data, this.botIP);
            const v = JSON.parse(data.json.v)
            switch (v.origin){
                case 'MSG':
                    this.emit('message', enrichedEvent);
                case 'DELMEN':
                    this.emit('delman', enrichedEvent);
                case 'NEWMAN':
                    this.emit('newman', enrichedEvent);
                case 'SYNCDLMSG':
                    this.emit('deleted message', enrichedEvent);
            }
        };

        // 에러 발생 시
        this.ws.onerror = (error:Event) => {
            this.emit('error',error)
        };

        this.ws.onclose = () => {
            this.emit('disconnect')
        };
    }

    query(sql:string, bind:Array<string>){
        const playload = {
            "query":sql,
            "bind":bind
        }
        console.log(JSON.stringify(playload))
        return fetch(`http://${this.botIP}/query`, {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json',  // 요청 데이터의 타입을 JSON으로 설정
          },
          body: JSON.stringify(playload),
        }).then((res)=>{
            const body = res.json()
          return body
        }).then((body)=>{
            return body
        }).catch((error)=>{
          return error
        })
    }
}