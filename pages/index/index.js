import request from '../../utils/request'
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    recommends: [],
    toplist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  gorecommend() {
    wx.navigateTo({
      url: '/song_package/pages/recommendSong/recommendSong'
    })
  },
  async getBanner() {
    let result = await request('/banner', {
      type: 2
    })
    const {
      banners,
      code
    } = result;
    if (code === 200) this.setData({
      banners
    })

  },
  async getRecommends() {
    let results = await request('/personalized', {
      limit: 10
    })
    const {
      result,
      code
    } = results;
    if (code === 200) this.setData({
      recommends: result
    })
  },
  async getTopList() {
    let count = 0
    let toplist = []
    while (count < 5) {
      let results = await request('/top/list', {
        idx: count++
      })
      const {
        code,
        playlist
      } = results
      if (code === 200) {
        toplist.push({
          name: playlist.name,
          tracks: playlist.tracks.slice(0, 3)
        })
      }
      this.setData({
        toplist
      })
    }
  },
  onLoad: function (options) {
    // wx.request({
    //   url: 'http://localhost:3000/banner',
    //   success(res) {
    //     console.log(res.data)
    //   },
    //   fail(error) {
    //     console.log(error);
    //   }
    // })
    this.getBanner();
    this.getRecommends();
    this.getTopList();
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