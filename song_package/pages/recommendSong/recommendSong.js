import PubSub from 'pubsub-js'
import request from '../../../utils/request'
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    songlist: [],
    index: 0, //当前点击的歌曲的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  gosongdetail(e) {
    let id = e.currentTarget.id
    let index = e.currentTarget.dataset.index
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/song_package/pages/songDetail/songDetail?id=' + id,
    })
  },
  onLoad: function (options) {
    let userinfo = wx.getStorageSync('userinfo');
    if (!userinfo) {
      wx.showToast({
        title: '未登录',
        icon: 'none',
        success: (result) => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        },
      })
      return
    }
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getsonglist()
    // 订阅切换歌曲类型
    PubSub.subscribe('switchtype', (msg, type) => {
      let {songlist,index} = this.data
      if (type === 'pre') { //上一首
        (index === 0) && (index = songlist.length);
        index--
      } else { //下一首
        (index === songlist.length - 1) && (index = -1);
        index++
      }
      this.setData({index})
      let musicid = songlist[index].id
      // 发布切换后的音乐id
      PubSub.publish('musicid', musicid)
    });
  },
  async getsonglist() {
    let result = await request('/recommend/songs')
    const {
      code,
      recommend
    } = result
    if (code === 200) {
      let songlist = recommend.map(song => ({
        id: song.id,
        name: song.name,
        picUrl: song.album.picUrl,
        author: song.artists[0].name
      }))
      this.setData({
        songlist,
      })
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