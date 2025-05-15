import { MessageEvent } from "../../irisjs/message";
import { ICommand } from "./ICommand";

import os from 'os';

const status = {
  uptime: os.uptime(), // 시스템 가동 시간 (초)
  totalMem: os.totalmem(), // 총 메모리 (bytes)
  freeMem: os.freemem(), // 사용 가능한 메모리 (bytes)
  usedMem: os.totalmem() - os.freemem(), // 사용 중인 메모리 (bytes)
  cpus: os.cpus(), // CPU 코어 정보 배열
  loadAvg: os.loadavg(), // [1분, 5분, 15분] 평균 로드 (Unix)
  platform: os.platform(), // 운영체제 플랫폼 (linux, win32 등)
  arch: os.arch(), // CPU 아키텍처 (x64 등)
  hostname: os.hostname(),
  tempDir: os.tmpdir(), // 임시 디렉토리 경로
};


export class ServerInfoCommand implements ICommand{
    async handle(event: MessageEvent): Promise<void> {
        try{
            const cpuPercent = await getCpuUsagePercent();
            const totalMem = os.totalmem();
            const freeMem  = os.freemem();
            const usedMem  = totalMem - freeMem;
            const memPercent = (usedMem / totalMem * 100).toFixed(2);

            const procMem    = process.memoryUsage().rss;             // Resident Set Size
            const procMemMB  = (procMem / 1024 / 1024).toFixed(2);

            const uptimeSec = os.uptime();
            const days    = Math.floor(uptimeSec / 86400);
            const hours   = Math.floor((uptimeSec % 86400) / 3600);
            const mins    = Math.floor((uptimeSec % 3600) / 60);

            const statusText =
                `서버 상태\n` +
                `====================\n` +
                `가동 시간   : ${days}일 ${hours}시간 ${mins}분\n` +
                `CPU 사용률 : ${cpuPercent}%\n` +
                `시스템 메모리 사용 : ${(usedMem/1024/1024).toFixed(2)}MB / ${(totalMem/1024/1024).toFixed(2)}MB (${memPercent}%)\n` +
                `프로세스 메모리 : ${procMemMB}MB (RSS)\n` +
                `코어 수     : ${os.cpus().length}\n` +
                `플랫폼     : ${os.platform()} (${os.arch()})`;

            event.replyText(statusText);
        }catch(e){
            event.replyText('시스템 정보를 불러오지 못했습니다.')
        }
    }
    help: string | null = "봇이 돌아가고 있는 서버 상태를 가져옵니다.";
    invoke: string = "상태";
    
}

function getCpuUsagePercent() {
  return new Promise<number>((resolve) => {
    const cpus1 = os.cpus();

    setTimeout(() => {
      const cpus2 = os.cpus();
      let idleDiff = 0;
      let totalDiff = 0;

      for (let i = 0; i < cpus1.length; i++) {
        const cpu1 = cpus1[i].times;
        const cpu2 = cpus2[i].times;

        const idle  = cpu2.idle  - cpu1.idle;
        const total = (cpu2.user + cpu2.nice + cpu2.sys + cpu2.idle + cpu2.irq)
                    - (cpu1.user + cpu1.nice + cpu1.sys + cpu1.idle + cpu1.irq);

        idleDiff  += idle;
        totalDiff += total;
      }

      const usage = (1 - idleDiff / totalDiff) * 100;
      resolve(Number(usage.toFixed(2)));
    }, 100);
  });
}
