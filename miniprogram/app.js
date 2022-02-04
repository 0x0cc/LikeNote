// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
        // env: 'cloud1-8gsiazug86a92de4'
        env: 'scnu-user-8gq0p5390acf2a6c'
      });
    }
    // 获取设备信息
    wx.getSystemInfo({
      success: (result) => {
        this.globalData.statusHeight = result.statusBarHeight;
        this.globalData.screenHeight = result.screenHeight;
        this.globalData.screenWidth = result.screenWidth;
      },
    })
  },
  globalData: {
    // 状态栏高度
    statusHeight: '',
    // 屏幕高度
    screenHeight: '',
    // 屏幕宽度
    screenWidth: '',
  }
});
