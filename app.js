//app.js
App({
  globalData: {
    personnelno: null
  },
  onLaunch: function() {
    this.quicklogin
  },
  checkLoginStatus: function() {
    let{personnelno} = this.globalData
    if(personnelno != null) {
      return true
    }
    else {
      isLogin = this.quickLogin()
      return isLogin
    }
  },
  quickLogin: function() {
    try {
      const value = wx.getStorageSync('session_key')
      if(value) {
        // wx.request({
        //   url: 'https://davidp.top/api/quicklogin',
        //   method: 'GET',
          

        // })
        return true
      }
    } catch (e) {
      return false
    }
  }
})