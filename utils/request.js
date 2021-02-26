import {
    BASE_URL
} from '../config/index'
export default (url, data, method = 'GET') => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: BASE_URL + url, //仅为示例，并非真实的接口地址
            data,
            header: {
                cookie: wx.getStorageSync('cookie'),
            },
            success(res) {
                if (data && data.islogin) {
                    wx.setStorage({
                        data: res.cookies.find(item => item.indexOf('MUSIC_U') !== -1),
                        key: 'cookie',
                    })
                }
                resolve(res.data)
            },
            fail(error) {
                reject(error)
            }
        })
    })

}