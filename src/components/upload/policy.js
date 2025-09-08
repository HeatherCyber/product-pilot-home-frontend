import http from '@/utils/httpRequest.js'
export function policy() {
   return  new Promise((resolve,reject)=>{
        http({
            url: http.adornUrl("/service/oss/policy"),
            //这里先写成固定的，后面通过nacos和网关解决
            // url: "http://localhost:7070/oss/policy",
            method: "get",
            params: http.adornParams({})
        }).then(({ data }) => {
            resolve(data);
        })
    });
}
