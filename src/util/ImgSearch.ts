import axios from "axios";
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import { load } from 'cheerio';

const jar = new CookieJar();
const NID = "524=n-7IiQWfIrljc_ojyGMz7t32LMBAh5WvAopb3rD68T3mm5p6dU2QvDjG7MJtwDia2GU4coCSgaU9kCb5SLA8Yur9R0IIPInrxTeekqYwhnc3__pHwb3qMBhX6abpjZ6N17101stuRvmk6QBGDufMw_Cqv16R124atdWI58dPUxdY-WJFZQFUiMl-joDvm57pkS9_tEoE5bAlWkqqe1qf_IBdOqcXc8FvdIPHbMg-fE-0farlS9CcKwXyB83sgt3MBDw";
const AEC = "AVcja2fdo_lZB5-wHru2XBxGM8FyJ7vvrQ_3FDpeOVF19W0aFhKm8BNZXg; Path=/; Domain=google.com; Secure; HttpOnly";

jar.setCookieSync(`NID=${NID}; Domain=google.com; Path=/`, 'https://google.com');
jar.setCookieSync(`AEC=${AEC}; Domain=google.com; Path=/`, 'https://google.com');


const client = wrapper(axios.create({ jar, withCredentials: true }));
export const ImgSearchByLink = async(imgURL:string) => {
  try {
    const response = await client.get(`https://lens.google.com/v3/upload?url=${encodeURIComponent(imgURL)}`, {
        headers: {
            Connection: 'keep-alive',
            Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
            'Accept-Encoding':'gzip, deflate, br'
        }
    }); 
    //console.log('응답 상태:', response.status);
    //console.log(response.status, response.headers.location || response.data);
    //console.log('최종 URL:', response.request.res.responseUrl);
    
    const $ = load(response.data);

    // "관련 검색어" 헤더 찾기
    const h2 = $('h2')
    .filter((i, el) => $(el).text().includes('관련 검색어'))
    .first();

    const result: string[] = [];

    // h2 바로 뒤에 있는 모든 <a> 요소 순회
    h2.nextAll('a').each((i, el) => {
    const txt = $(el).find('span').text().trim();
    if (txt) result.push(txt);
    });

    const texts:string[] = [];

    $('div[role="heading"]').each((_, el) => {
      texts.push($(el).text().trim());
    });

    return {related:result, result:texts};

  } catch (error) {
    console.error(error);
  }
}


import { LanguageServiceClient } from "@google-cloud/language";
  

const people=[]
export async function analyzeEntities(texts:string[]) {
  const client = new LanguageServiceClient();

  const document = {
    content: texts.join('\n'),
    type: 'PLAIN_TEXT',
    language: 'ko',
  };

  const [result] = await client.analyzeEntities({ document });
    result.entities.forEach(entity => {
    console.log(entity.name, '→', entity.type);
    if (entity.type === 'PERSON') {
        entity.mentions.forEach(mention => {
        // mention.type도 확인해 보고 싶으면 출력해 보세요
        if (mention.type === 'PROPER') { 
            people.push(mention.text.content);
        }
        });
    }
  });
  console.log(people)
}
