import request from '../../utils/request'
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'

// pages/personal/personal.js
let clientystart
let clientymove
let offsetheight
Page({

  /**
   * 页面的初始数据
   */
  data: {
    translatey: 'translateY(0rpx)',
    transition: '',
    userinfo: {},
    recordplaylist:[],
  },
  gologin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  touchstart(e) {
    clientystart = e.touches[0].clientY
    this.setData({
      transition: '',
    })
  },
  touchmove(e) {
    clientymove = e.touches[0].clientY
    offsetheight = clientymove - clientystart
    if (offsetheight < 0) offsetheight = 0
    if (offsetheight > 90) offsetheight = 90
    this.setData({
      translatey: `translateY(${offsetheight}rpx)`
    })
  },
  touchend(e) {
    this.setData({
      translatey: 'translateY(0rpx)',
      transition: 'all 2s',
    })
  },
  async getrecordplaylist(){
    const uid = this.data.userinfo.userId
    let result = await request('/user/record',{
      uid,
      type:1,
    })
    const {code,weekData} = result
    if(code===200 && weekData.length>0){
      this.setData({
        recordplaylist:weekData.splice(0,10)
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      if(this.data.userinfo.userId) return
      var value = wx.getStorageSync('userinfo')
      if (value) {
        let userinfo = JSON.parse(value)
          this.setData({
            userinfo
          })
        }
    } catch (e) {
      // Do something when catch error
    }
    this.getrecordplaylist()
   
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