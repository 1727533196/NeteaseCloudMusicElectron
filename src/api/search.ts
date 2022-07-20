import request from "@/utils/request";


export const cloudSearch = (keywords: string, limit = 30) => request('/cloudsearch', {keywords, limit})