// pages/login/login.js
Page({
  data: {
    id: null,
    passwordLib: null,
    passwordSpace: null,
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

  }
})

function getJson(id, passwordLib, passwordSpace) {
  wx.request({
    url: 'https://davidp/api/login',
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
    // success: function (res) {
      
    // }
  })

}