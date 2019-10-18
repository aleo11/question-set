import axios from 'axios'
import { message } from 'antd';

export default class Axios{
    static ajax=(options)=>{
        return new Promise((resolve,reject)=>{
            let loading=document.getElementById("ajax-loading")
            if(options&&options.isShowLoading!==false){
                loading.style.display="inline-block"
            }
            axios({
                method:'post',
                url:options.url,
                timeout:10000,
                data:options.data
            }).then((res)=>{
                if(res.status===200&&res.data.code===0){
                    if(options.isShowLoading!==false){
                        loading.style.display="none"
                    }
                    res.data.msg && message.info(res.data.msg)
                    resolve(res.data.data)
                }else{
                    reject(res)
                }
            }).catch((err)=>{
                message.info("网络请求超时")
                reject(err)
            })
        })
    }
}