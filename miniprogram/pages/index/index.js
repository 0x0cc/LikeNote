// pages/index/index.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 设备信息
    statusHeight: getApp().globalData.statusHeight,
    screenHeight: getApp().globalData.screenHeight,
    screenWidth: getApp().globalData.screenWidth,
    // 头像高度
    avatarHeight: null,
    // 添加按钮高度
    fix_button: null,
    // 添加按钮动画
    animation: '',
    // 顶部滑块样式
    slide_block: 'top_slide_block_left',
    // openid
    openid: '',
    // 当前页面 0为最新 1为最热
    current: 0,
    // 触摸点
    startX: '',
    // 页面内容
    content: [],
    like: {},
  },

  /**监听切换最新/最热
   */
  // 监听触摸开始
  slideStart: function(e) {
    console.log(e);
    var startX = e.changedTouches[0].pageX;
    this.setData({
      startX: startX
    })
  },
  slideEnd: function(e) {
    console.log(e);
    var endX = e.changedTouches[0].pageX;
    var startX = this.data.startX;
    var distance = endX-startX;
    console.log(distance)
    // 负数为向左 正数向右
    if(distance >= 80) {
      this.setData({
        current: 1,
        slide_block: 'top_slide_block_right'
      })
      console.log("切换到最热")
    }
    else if(distance <= -80) {
      this.setData({
        current: 0,
        slide_block: 'top_slide_block_left'
      })
      console.log("切换到最新")
    }
  },
  // 顶部点击事件
  newest: function(e) {
    this.setData({
      current: 0,
      slide_block: 'top_slide_block_left'
    })
  },
  hottest: function(e) {
    this.setData({
      current: 1,
      slide_block: 'top_slide_block_right'
    })
  },

  // 检查登陆状态
  checkLog: function() {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success:(res) =>{
        console.log(res);
        if(res.data.length == 0) {
          console.log("empty data");
          that.gotoLog();
          return -1;
        }
        that.setData({
          openid: res.data,
        })
        return 0;
      },
      fail:(res) =>{
        console.log(res)
        that.gotoLog();
        return -1;
      }
    })
  },
  // 跳转登录
  gotoLog: function(e) {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  // 获取帖子
  getPosts: function(e) {
    var content = [];
    var that = this;
    wx.cloud.callFunction({
      name: 'getPosts',
      data: {
        // 请求审核通过的记录
        acquire: true
      },  
      success:(res)=> {
        console.log(res.result.data);
        if(res.result.data.length == 0) {
          wx.showToast({
            title: '没有更多了',
            icon: 'error',
            duration: 800
          })
          return;
        }
        else {
          content = res.result.data;
          content.reverse();
          that.setData({
            content: content
          })
        }
      }
    })
  },

  // 去发言
  navWrite: function(e) {
    this.buttonAni(90,500);
    var that = this;
    setTimeout(function(){
      // 清除动画
      that.buttonAni(0,0);
      wx.navigateTo({
        url: '../write/write',
      })
    },500)
  },

  // 按钮动画
  buttonAni: function(deg,drt) {
    var animation = wx.createAnimation({
      delay: 0,
      duration: drt,
      timingFunction: 'ease'
    })
    animation.rotate(deg).step();
    animation = animation.export();
    this.setData({
      animation: animation
    })
  },

  // 点击帖子显示详情
  showDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id,
    })
  },

  // 是否已点赞
  checkLike: function(e) {
    var openid = this.data.openid;
    console.log(openid)
    var like = {};
    db.collection('posts').get()
    .then(res=> {
      console.log(res);
      for(var idx of res.data) {
        for(var piv of idx['like']) {
          if(piv == openid) {
            like[idx['_id']] = true;
          }
          else {
            like[idx._id] = false;
          }
        }
      }
      this.setData({
        like: like
      })
    })
  },
  // 点赞/取消
  dealLike: function(e) {
    var id = e.currentTarget.dataset.id;
    var openid = this.data.openid;
    wx.cloud.callFunction({
      name: 'addLike',
      data: {
        id: id,
        openid: openid,
      },
    })
    .then(res=> {
      console.log(res);
      var like = this.data.like;
      like[id] = !like[id];
      this.setData({
        like: like
      })
      this.onLoad();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var avatarHeight = this.data.screenWidth;
    var fix_button = avatarHeight*0.15;
    avatarHeight = avatarHeight*0.9*0.15;
    this.setData({
      avatarHeight: avatarHeight,
      fix_button: fix_button
    })
    this.checkLog();
    this.getPosts();  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.checkLike();
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
    this.onLoad();
    setTimeout(function(){
      wx.stopPullDownRefresh({
        success: (res) => {
          console.log(res);
        },
      })
    },500);
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