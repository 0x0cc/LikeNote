// pages/write/write.js
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
    // openid
    openid: '',
    // 用户信息
    nickName: '',
    avatar: '',
    // 返回
    back: '<',
    // 当前时间
    time: '',
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
        this.getUserInfo();
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
    wx.redirectTo({
      url: '../login/login',
    })
  },

  // 获取现在时间
  getTime: function(e) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var time = '';
    time += year + '-' + month + '-' + day;
    this.setData({
      time: time
    })
  },

  // 点击返回
  navBack: function(e) {
    wx.navigateBack({
      delta: 0,
    })
  },

  // 提交
  submit: function(e) {
    var ctn = e.detail.value.ctn;
    if(ctn.length == 0) {
      wx.showToast({
        title: '写点东西吧',
        icon: 'none',
        duration: 800
      })
    }
    else {
      // 首先获取当前日期
      this.getTime();
      var index = [];
      var piv = 0;
      for(var idx=0; idx<ctn.length; idx++) {
        // 分段存储
        if(ctn[idx] == '\n') {
          var prg = ctn.slice(piv,idx);
          console.log(prg);
          index.push(prg);
          piv = idx+1;
          continue;
        }
        else if(idx == ctn.length-1 && piv != idx) {
          var prg = ctn.slice(piv,idx+1);
          console.log(prg);
          index.push(prg);
        }
      }
      console.log(index);
      // 上传数据库
      var nickName = this.data.nickName;
      var avatar = this.data.avatar;
      var openid = this.data.openid;
      var time = this.data.time;
      db.collection('posts').add({
        data: {
          openid: openid,
          nickName: nickName,
          avatar: avatar,
          ctn: index,
          time: time,
          // 待审核
          pass: false,
          // 点赞数
          like_count: 0,
          like: [],
          cmt_count: 0,
        },
        success:(res)=> {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 800
          })
          // 清空输入
          e.detail.value = '';
          setTimeout(function(){
            wx.navigateBack({
              delta: 0,
            })
          },1000);
        },
        fail:(res)=> {
          wx.showToast({
            title: '提交失败',
            icon: 'error',
            duration: 800
          })
        }
      })
    }
  },

  getUserInfo: function(e) {
    var that = this;
    var openid = this.data.openid;
    db.collection('users').where({
      openid: openid
    }).get({
      success:(res)=> {
        console.log(res.data)
        that.setData({
          nickName: res.data[0].nickName,
          avatar: res.data[0].avatar,
        })
      },
      fail:(res)=> {
        console.log(res);
        wx.showToast({
          title: '用户登录信息错误，请重新登录',
          icon: 'error',
          duration: 800
        })
        setTimeout(function(){
          wx.navigateTo({
            url: '../login/login',
          })
        },800)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var avatarHeight = this.data.screenWidth;
    avatarHeight = avatarHeight*0.9*0.15;
    this.setData({
      avatarHeight: avatarHeight
    })
    // 检查登录状态
    that.checkLog();
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