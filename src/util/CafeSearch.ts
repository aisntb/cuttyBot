import axios from "axios";

export async function searchCafeUser(keyword:string){
    const res = await axios.get(`https://apis.naver.com/cafe-web/cafe-mobile/CafeMobileWebArticleSearchListV4?cafeId=29537083&query=${encodeURI(keyword)}&searchBy=3&sortBy=date&page=1&perPage=20&adUnit=MW_CAFE_BOARD&ad=true`)
    const result = res.data.message?.result?.articleList[0]?.item?.memberKey
    return result
}