import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../../utils/request'
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime'
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isplay: false,
    id: '',
    song: {}, // 歌曲的信息
    musiclink: {}, //歌曲的链接信息
    currentTime:'00.00',//播放的当前进度
    durationTime:'00.00', //歌曲的总时长
    playprogress:0,//当前播放进度
  },
  // 请求歌曲的信息song的信息
  async getsonginfo(id) {
    
    let result = await request('/song/detail', {
      ids: id
    });
    console.log('请求歌曲的信息song的信息');
    const {
      code,
      songs
    } = result
    if (code === 200) {
      let {
        musiclink
      } = this.data
      let oldid = this.data.id
      let song = songs[0]
      console.log(oldid,id);
      if (oldid==id && musiclink.url) {
        console.log('请求连接比请求信息先执行，所以我进来了');
        this.setBackgroundAudio({
          id,
          song
        })
      }
      this.setData({
        song,
        durationTime:moment(song.dt).format('mm:ss'),
      })
      // 设置页面标题
      wx.setNavigationBarTitle({
        title: song.name
      })

    }
  },
  // 获取歌曲的链接信息
  async getMusicLink(id) {
    let result = await request('/song/url', {
      id
    });
    console.log('获取歌曲的链接信息');
    const {
      code,
      data
    } = result
    if (code === 200) { //如果拿到了歌曲链接，就设置后台播放
      let musiclink = data[0]
      let {
        song
      } = this.data
      // 请求到的歌曲信息数据设置背景音乐后台
      this.setBackgroundAudio({
        id,
        song,
        musiclink
      })
      this.setData({
        id,
        musiclink
      })
    }
  },
  // 点击播放按钮的回调
  musicPlayControl() {
    let {
      id,
      isplay,
      musiclink,
    } = this.data
    console.log('当前id',id);
    // 状态里拿歌曲的链接信息，如果拿不到发请求
    if (!musiclink.url) {
      this.getMusicLink(id)
    } else { // 如果拿到了，说明不是第一次请求，就暂停或者播放
      if (isplay) this.backgroundAudioManager.pause()
      else this.backgroundAudioManager.play()
    }
  },
  // 点击切换歌曲的回调
  switchSong(e) {
    // 获取切歌的类型
    let type = e.currentTarget.id;

    // 关闭当前播放的音乐
    this.backgroundAudioManager.stop();
    // // 订阅来自recommendSong页面发布的musicId消息
    PubSub.subscribe('musicid', (msg, musicid) => {
      this.getsonginfo(musicid)
      this.getMusicLink(musicid)
      PubSub.unsubscribe('musicid');
    })
    // 发布消息数据给recommendSong页面
    PubSub.publish('switchtype', type)
  },
  // 设置背景音乐后台管理的信息的方法
  setBackgroundAudio({
    id,
    song,
    musiclink
  }) {
    if (song) { //如果有歌曲信息就设置
      this.backgroundAudioManager.title = song.name
      this.backgroundAudioManager.epname = song.al.name
      this.backgroundAudioManager.singer = song.ar[0].name
      this.backgroundAudioManager.coverImgUrl = song.al.picUrl
    }
    // 如果有链接信息就设置
    if (musiclink) {
      this.backgroundAudioManager.src = musiclink.url
    }
    // 监视音乐播放/暂停/停止
    this.backgroundAudioManager.onPlay(() => {
      this.setData({
        isplay: true
      })
      // 修改全局音乐播放的状态
      appInstance.globalData.musicId = id;
      appInstance.globalData.ismusicplay = true
    });
    this.backgroundAudioManager.onPause(() => {
      this.setData({
        isplay: false
      })
      // 修改全局音乐播放的状态
      appInstance.globalData.ismusicplay = false
    });
    this.backgroundAudioManager.onStop(() => {
      this.setData({
        isplay: false
      })
      // 修改全局音乐播放的状态
      appInstance.globalData.ismusicplay = false
    });
    // 监控音乐播放进度，修改进度条
    this.backgroundAudioManager.onTimeUpdate(()=>{
      let {currentTime,duration} = this.backgroundAudioManager
      let playprogress = currentTime*460/duration
      this.setData({
        currentTime:moment(currentTime*1000).format('mm:ss'),
        playprogress,
      })
    })
    this.backgroundAudioManager.onEnded(()=>{
      this.switchSong('next')
    })
  },
  // 页面被加载
  onLoad: function (options) {
    console.log('app---',appInstance.globalData.musicId,appInstance.globalData.ismusicplay);
    let id = options.id // 推荐组件传过来的当前点击的推荐歌曲的id
    console.log('当前点击的id',typeof id);
    this.setData({
      id
    })
    //页面被加载，请求当前点击的歌曲的信息
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.getsonginfo(id)
    // 判断app里的全局播放记录，有没有当前的音乐播放记录，如果有就设置播放状态为true
    if (appInstance.globalData.musicId == id && appInstance.globalData.ismusicplay) {
      this.setData({
        isplay: true
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