import { bufferToBase64 } from "../util";

export interface RawMessageData {
    _id: string;
    id: string;
    type: string;
    chat_id: string;
    user_id: string;
    message: string;
    attachment: string;
    created_at: string;
    deleted_at: string;
    client_message_id: string;
    prev_id: string;
    referer: string;
    supplement: any; // null 또는 객체 가능성이 있음
    v: string; // JSON 문자열이므로 별도 파싱 필요
  }
  
  export interface DecodedV {
    notDecoded: boolean;
    origin: string;
    c: string;
    modifyRevision: number;
    isSingleDefaultEmoticon: boolean;
    defaultEmoticonsCount: number;
    isMine: boolean;
    enc: number;
  }
  
  export interface IMessageEvent {
    msg: string;
    room: string;
    sender: string;
    json: RawMessageData;
    parsedV?: DecodedV; // v를 JSON.parse 한 결과를 여기에 담을 수도 있음
  }

  export class MessageEvent implements IMessageEvent {
    msg: string;
    room: string;
    sender: string;
    json: RawMessageData;
    parsedV?: DecodedV;
    botIP: string;
  
    constructor(event: IMessageEvent, BOTIP: string) {
      // 인터페이스의 필드를 클래스에 복사
      this.msg = event.msg;
      this.room = event.room;
      this.sender = event.sender;
      this.json = event.json;
      this.parsedV = event.parsedV;
      this.botIP = BOTIP
    }
  
    // replyText 메서드 구현
    replyText(text: string) {
        const messagePayload = {
          type: "text",
          room: this.json.chat_id,  // 메시지가 속한 채팅의 ID
          data: text,  // 보낼 메시지 내용
        };
  
        fetch(`http://${this.botIP}/reply`, {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json',  // 요청 데이터의 타입을 JSON으로 설정
          },
          body: JSON.stringify(messagePayload),
        }).then((data)=>{
          return data;
        }).catch((error)=>{
          return error
        })
      }

    replyImage(image: Buffer) {
        const messagePayload = {
          type: "image",
          room: this.json.chat_id,  // 메시지가 속한 채팅의 ID
          data: bufferToBase64(image),  // 보낼 메시지 내용
        };
  
        fetch(`http://${this.botIP}/reply`, {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json',  // 요청 데이터의 타입을 JSON으로 설정
          },
          body: JSON.stringify(messagePayload),
        }).then((data)=>{
          return data;
        }).catch((error)=>{
          return error
        })
      }
  }