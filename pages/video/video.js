// pages/video/video.js
import request from '../../utils/request'
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navlist: [],
    currentid: 0,
    videolist: [],
    playingvid: '',
    playtimerecords: [],
    isTriggered: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getnavlist()
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  handlerefresh() {
    this.setData({
      isTriggered: true
    })
    this.getvideolist(this.data.currentid)
  },
  handlebindended(e) {
    let vid = e.target.id,
      {
        playtimerecords
      } = this.data,
      currentindex = playtimerecords.findIndex(item => item.vid === vid)
    playtimerecords.splice(currentindex, 1)
    this.setData({
      playtimerecords
    })
  },
  handleplay(e) {
    let vid = e.target.id
    // this.vid && this.vid !== e.target.id && this.videocontext && this.videocontext.stop()
    // this.vid = e.target.id
    let currentvideorecord = this.data.playtimerecords.find(item => item.vid === vid)
    this.setData({
      playingvid: vid
    })
    this.VideoContext = wx.createVideoContext(vid)
    currentvideorecord && currentvideorecord.playtime && this.VideoContext.seek(currentvideorecord.playtime)
    this.VideoContext.play()
  },
  handletimeupdate(e) {
    let vid = e.currentTarget.id,
      playtime = e.detail.currentTime,
      cplaytime = {
        vid,
        playtime
      },
      {
        playtimerecords
      } = this.data,
      currentrecord = playtimerecords.find(item => item.vid === vid)
    if (currentrecord) {
      currentrecord.playtime = playtime
    } else {
      playtimerecords.push(cplaytime)
      this.setData({
        playtimerecords
      })
    }
  },
  tapName: function (event) {
    wx.showLoading({
      title: '加载中',
    })
    const currentid = event.currentTarget.dataset.id
    this.setData({
      currentid,
      videolist: [],
    })
    this.getvideolist(currentid)
  },
  async getvideolist(id) {
    let result = await request('/video/group', {
      id
    })
    const {
      code,
      datas
    } = result
    if (code === 200) {
      this.setData({
        videolist: datas,
        isTriggered: false,
      })
      wx.hideLoading()
    }
  },
  async getnavlist() {
    wx.showLoading({
      title: '加载中',
    })
    let result = await request('/video/group/list')
    const {
      code,
      data
    } = result
    if (code === 200 && data.length > 0) {
      this.setData({
        navlist: data.slice(0, 14),
        currentid: data[0].id
      })
      this.getvideolist(this.data.currentid)
      wx.hideLoading()
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