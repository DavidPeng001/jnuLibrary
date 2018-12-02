Page({
  data: {
    inputdata: null,
  },
  bindinput: function(input) {
    this.setData({
      inputdata: input.detail.value
    })
  },
  bindconfirm: function () {
    console.log("Search Start")
    var json = getJson(this) 
  }  
})

function getJson(that) {   // that -> Page obj
  var jsonString = getJsonString(that)
}

function getJsonString(that) {
  var jsonString 
  var keyword = that.data.inputdata
  wx.request({
    url: 'http://47.107.169.123/api/search',
    method: 'POST',
    data: {
      keyword: keyword,
      page: 0       
    },
    //TODO: 循环懒加载换页 通过检测页面高度
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: function (res) {
      console.log(res.data)
      jsonString = res.data
    //TODO: 加载错误反馈
    }
  })
  console.log(keyword)
  console.log(jsonString)
}