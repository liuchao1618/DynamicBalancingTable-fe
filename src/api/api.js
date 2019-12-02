import axios from 'axios'

let base = ''

export const deviceInfo = params => { return axios.get(`${base}/api/device/info`, { params: params }) }
