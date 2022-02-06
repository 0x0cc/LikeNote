// pages/person/person.js

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
    // 用户登录唯一凭证
    openid: '',
    info: [],
    // 用户头像
    avatar: '',
    // 用户昵称
    nickName: '',
    // 身份认证
    identity: [],
  },
  // 检查登陆状态
  checkLog: function(e) {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success:(res) =>{
        console.log(res);
        if(res.data.length == 0) {
          console.log("empty data");
          that.gotoLog();
          return;
        }
        that.setData({
          openid: res.data
        })
        that.getInfo();
      },
      fail:(res) =>{
        console.log(res)
        that.gotoLog();
        return;
      }
    })
  },
  // 跳转登录
  gotoLog: function(e) {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  // 检查认证
  checkIdentity: function(e) {
    // // 管理员
    var openid = this.data.openid;
    // db.collection('administer').where({
    //   openid: openid
    // }).get()
    // .then(res=> {
    //   console.log(res)
    //   if(res.data.length != 0) {
    //     // 管理员验证成功
    //     iden.push('管理员')
    //     this.setData({
    //       identity: iden
    //     })
    //   }
    // })
    // 其他认证
    db.collection('users').where({
      openid: openid
    }).get()
    .then(res=> {
      var iden = res.data[0].identity;
      var identity = [];
      for(var idx of iden) {
        identity.push(idx);
      }
      this.setData({
        identity: identity
      })
    })

  },
  // 初始化数据
  getInfo: function(e) {
    var that = this;
    var openid = this.data.openid;
    db.collection('users').where({
      openid: openid
    }).get({
      success:(res) => {
        var info = res.data
        that.setData({
          nickName: info[0].nickName,
          avatar: info[0].avatar
        })
        this.checkIdentity();
      },
      fail:(res)=> {
        console.log(res);
        wx.showToast({
          title: '初始化失败',
          icon: 'error',
          duration: 800
        })
      }
    })
  },

  verify: function(e) {
    // 检查管理者权限
    var openid = this.data.openid;
    console.log(openid);
    db.collection('administer').where({
      openid: openid
    }).get()
    .then(res=> {
      console.log(res)
      if(res.data.length != 0) {
        // 管理员验证成功
        wx.navigateTo({
          url: '../verify/verify',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var avatarHeight = this.data.screenWidth;
    avatarHeight = avatarHeight*0.9*0.25;
    this.setData({
      avatarHeight: avatarHeight
    })
    this.checkLog();
    console.log(this.data)
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