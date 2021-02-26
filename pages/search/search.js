import request from '../../utils/request'
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'
// pages/search/search.js
let isSending = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultplaceholder: '',
    hotlist: [],
    searchkeywords: '',
    searchcontent: [],
    historylist: [],
  },
  // 获取默认placeholder
  async getdefaultplaceholder() {
    let result = await request('/search/default')
    const {
      code,
      data
    } = result
    if (code === 200) {
      this.setData({
        defaultplaceholder: data.showKeyword,
      })
    }
  },
  // 获取热搜列表
  async gethostlist() {
    let result = await request('/search/hot/detail')
    const {
      code,
      data
    } = result
    if (code === 200) {
      this.setData({
        hotlist: data
      })
    }
  },
  // 获取搜索的信息
  async getsearchcontent(keywords) {
    let results = await request('/search', {
      keywords,
      limit: 10,
    })
    const {
      code,
      result
    } = results
    if (code === 200) {
      let {
        historylist
      } = this.data
      let index = historylist.findIndex(item => item === keywords)
      if (index !== -1) {
        historylist.splice(index, 1)
      }
      historylist.unshift(keywords)
      wx.setStorageSync('historylist', historylist)
      this.setData({
        searchcontent: result.songs,
        historylist,
      })
    }
  },
  // 设置输入监听，如果有状态关键字有值就发请求
  handleinput() {
    let keywords = this.data.searchkeywords.trim()
    if (isSending) return
    if (keywords === '') {
      this.setData({
        searchcontent: []
      })
      return
    }
    this.getsearchcontent(keywords)
    isSending = true
    setTimeout(() => {
      isSending = false
    }, 300);
  },
  // 点击清空按钮的回调
  clearkeywords() {
    this.setData({
      searchkeywords: '',
      searchcontent: [],
    })
  },
  // 点击清空历史记录的回调
  clearhistory() {
    wx.showModal({
      title: '警告',
      content: '确认删除?',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            historylist: [],
          })
          wx.removeStorageSync('historylist')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdefaultplaceholder()
    this.gethostlist()
    var historylist = wx.getStorageSync('historylist')
    if (historylist) {
      this.setData({
        historylist
      })
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