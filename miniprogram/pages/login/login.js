// pages/login/login.js

const db = wx.cloud.database();
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    // 设备信息
    statusHeight: getApp().globalData.statusHeight,
    screenHeight: getApp().globalData.screenHeight,
    screenWidth: getApp().screenWidth,
    // 用户登录唯一凭证
    openid: '',
    // 用户头像
    avatar: '',
    // 用户昵称
    nickName: '',
  },

  login: function(e) {
    var that = this;
    wx.getUserProfile({
      desc: '登录',
      success: (res)=> {
        console.log("获取用户信息成功");
        console.log(res);
        var nickName = res.userInfo.nickName;
        var avatar = res.userInfo.avatarUrl;
        that.setData({
          nickName: nickName,
          avatar: avatar,
        })
        var openid = that.data.openid;
        console.log('openid: '+openid);
        if(openid.length == 0) {
          wx.showToast({
            title: '登录失败',
            icon: 'error',
            duration: 800
          })
          return;
        }
        // 检查是否已在数据库存在记录
        db.collection('users').where({
          openid: openid
        }).get().then(res=>{
        // 无记录，新增记录
        if(res.data.length == 0) {
          db.collection('users').add({
            data: {
              openid: openid,
              nickName: nickName,
              avatar: avatar,
            }
          })
        }
        // 已存在记录，更新记录
        else {
          db.collection('users').where({
            openid: openid
          }).update({
            data: {
              nickName: nickName,
              avatar: avatar
            }
          })
        }
      }).then(res=>{
        // 存储登录信息
        wx.setStorage({
          key: 'openid',
          data: that.data.openid,
          success:res => {
            // 跳转
            wx.switchTab({
              url: '../person/person',
            })
          }
        })
      })
      },
      fail: (res)=> {
        console.log(res);
        wx.showToast({
          title: '登陆失败',
          icon: 'error',
          duration: 800
        })
        return;
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取openid
    wx.cloud.callFunction({
      name: 'getUserId',
      data: {},
      success:(res)=> {
        console.log(res);
        that.setData({
          openid: res.result.openid
        })
        
      },
      fail: (res)=> {
        console.log(res);
        wx.showToast({
          title: '登录失败',
          icon: 'error',
          duration: 800
        })
        return;
      }
    })
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