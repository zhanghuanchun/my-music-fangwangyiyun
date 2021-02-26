// pages/login/login.js
import request from '../../utils/request'
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleinput(e) {
    let type = e.currentTarget.id
    this.setData({
      [type]: e.detail.value
    })
  },
  async login() {
    let {
      phone,
      password
    } = this.data
    let phoneReg = /^1(3|5|7|8|9)\d{9}$/
    if (phone.trim() === '' || password.trim() === '') {
      wx.showToast({
        title: '输入为空！',
        icon: 'none',
      })
    } else if (!phoneReg.test(phone.trim())) {
      wx.showToast({
        title: '手机号格式不正确！',
        icon: 'none',
      })
    } else {
      let result = await request('/login/cellphone', {
        phone,
        password,
        islogin:true,
      })
      const {
        code,
        token,
        profile,
        msg
      } = result
      if (code === 200) {
        let userinfo = JSON.stringify(profile) || '';
        try {
          wx.setStorageSync('userinfo', userinfo)
          
        } catch (error) {
          console.log(error);
        }
        // wx.showToast({
        //   title: '登录成功！',
        // })
        wx.reLaunch({
          url: '/pages/personal/personal',
        })
        return
      }
      if (code === 400) {
        wx.showToast({
          title: '手机号错误！',
          icon: 'none',
        })
      } else if (code === 502) {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      } else {
        wx.showToast({
          title: '其他错误！',
          icon: 'none',
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})