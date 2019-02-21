// pages/login/login.js
const app = getApp()
Page({
  data: {
    id: null,
    passwordLib: null,
    passwordSpace: null,
    errorInfo: null
  },
  onLoad: function (options) {
  },
  idInput: function(input) {
    this.setData(
      {
        id: input.detail.value
      }
    )
  },
  passwordLibInput: function (input) {
    this.setData(
      {
        passwordLib: input.detail.value
      }
    )
  },
  passwordSpaceInput: function (input) {
    this.setData(
      {
        passwordSpace: input.detail.value
      }
    )
  },
  loginBtnclk: function() {
    let{id, passwordLib, passwordSpace} = this.data
    this.login(id, passwordLib, passwordSpace).then((sessionid) => {
      wx.setStorageSync('session_key', sessionid)
      app.globalData.personnelno = id
      wx.navigateBack({
        delta: 1,
      })
    }).catch((info) => {
      console.log('Login fail: ' + info)
      this.setData({
        errorInfo: info,
      })
    })
  },
  login: function(id, passwordLib, passwordSpace) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://davidp.top/api/login/',
        method: 'POST',
        data: {
          'id': id,
          'passwd_lib': passwordLib,
          'passwd_space': passwordSpace,
        },
        header: {
          'content-type': 'application/json',
          'Accept': 'application/json'
        },
        success: function (res) {
          if (res.statusCode == 200 && res.header['Set-Cookie']) {
            if (res.data['status'] != 'wrong') {
              // console.log(res.header['Set-Cookie'])
              resolve(res.header['Set-Cookie'])
            } else {
              reject('人事编号或密码错误')
            }
          } else {
            reject('网络连接错误')
          }
        },
        error: function (e) {
          reject('网络连接错误')
        }
      })
    })
  },
})

