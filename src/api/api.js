import axios from 'axios'

let base 
if(process.env.NODE_ENV === 'development'){
    base = ''
}else if(process.env.NODE_ENV === 'production'){
    base = 'http://192.168.0.128:9001'
}

export const deviceInfo = params => { return axios.get(`${base}/api/device/info`, { params: params }) }
