//app.js
App({
  globalData: {
    personnelno: null
  },
  onLaunch: function() {
    console.log('-- Getting Personnelno --')
    this.getPersonnelno()
  },
  getPersonnelno: function() {
    // 异步函数，是否成功可检查personnelno值
    const value = wx.getStorageSync('session_key')
    let that = this
    if(value) {
      let header = {}
      header.Cookie = value
      console.log(header)
      wx.request({
        url: 'https://davidp.top/api/quicklogin/',
        method: 'GET',  
        header: header,
        dataType: 'json',
        success: function(res) {
          if (res.statusCode == 200 && res.data['id'] != 'wrong') {
            that.globalData.personnelno = res.data['id']
            // 若在app.js外执行该函数，将personnelno赋给当前页面Data
            if (getCurrentPages().length != 0 && typeof (getCurrentPages()[0].data.personnelno) != 'undefined')
              getCurrentPages()[0].setData({
                personnelno: res.data['id'],
              }) 
          } else {
            console.log('Can\'t get personnelno: bad connection.')
          }
        },
        error: function (e) {
          console.log('Can\'t get personnelno: bad connection.')
        }
      })
    } else {
      console.log('Can\'t get personnelno: no sessionkey.')
    } 
    return
  },

  logout: function(){
    var that = this
    wx.removeStorage({
      key: 'session_key',
      success: function (res) {
        that.globalData.personnelno = null
        console.log("logout success")
      }
    })
  },
  
  utf8Decode: function(utftext) {
    var string = ''
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c1 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
        i += 2;
      } else {
        c1 = utftext.charCodeAt(i + 1);
        c2 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
        i += 3;
      }
    }
  }
})