Page({
  data: {
    inputValue: null,
    contents: [],
    currentPage: 0,
    isLoading: true,
  },
  bindinput: function(input) {
    this.setData(
      {
        inputValue: input.detail.value
      }
    )
  },
  bindconfirm: function () {
    console.log("Search Starting. first load...") 
    let {contents, inputValue} = this.data
    var json = getJson(inputValue, 0)
    this.setData(
      {
        contents: contents.concat(json),
        isLoading: false,
        currentPage: 1,
      }
    )
  },
  onReachBottom: function() {
    console.log("reach bottom. loading...")
    let { currentPage, inputValue, isLoading, contents} = this.data
    if (isLoading) {
      return
    }
    this.setData(
      {
      isLoading: true
      }
    )
    var json = getJson(inputValue, currentPage)
    this.setData(
      {
        contents: contents.concat(json),
        currentPage: currentPage + 1,
        isLoading: false,
      }
    )

  }  
})
function getJson(inputValue, currentPage) {

  /////////////// WAITING FOR DOMAIN NAME /////////////

  // var jsonString 
  // var keyword = inputValue
  // wx.request({
  //   url: 'http://47.107.169.123/api/search',
  //   method: 'POST',
  //   data: {
  //     keyword: keyword, //TODO: uncode to unicode
  //     page: 0       
  //   },
  //  
  //   header: {
  //     'content-type': 'application/json',
  //     'Accept': 'application/json'
  //   },
  //   success: function (res) {
  //     console.log(res.data)
  //     jsonString = res.data
  //   //TODO: 加载错误反馈
  //   }
  // })
  // console.log(keyword)
  // console.log(jsonString)
  var teststring = '[{ "libinfo": [{ "status": "\u9986\u5185\u9605\u89c8", "index": "C/M2018/27", "location": "\u672c\u90e8\u516d\u697c\u672c\u6821\u535a\u7855\u5b66\u4f4d\u8bba\u6587" }], "name": "\u4f01\u4e1a\u793e\u4ea4\u8f6f\u4ef6\u7684\u4f7f\u7528\u5bf9\u7ec4\u7ec7\u6210\u5458\u521b\u65b0\u884c\u4e3a\u7684\u5f71\u54cd\u673a\u5236\u7814\u7a76", "auth": ["\u6c5f\u594e","112345"], "publish": " \u66a8\u5357\u5927\u5b66" }, { "libinfo": [{ "status": "\u9986\u5185\u9605\u89c8", "index": "TP/M2018/39", "location": "\u672c\u90e8\u516d\u697c\u672c\u6821\u535a\u7855\u5b66\u4f4d\u8bba\u6587" }], "name": "\u57fa\u4e8e\u4ee3\u7801\u56fe\u50cf\u6df1\u5ea6\u5b66\u4e60\u7684\u5b89\u5353\u6076\u610f\u8f6f\u4ef6\u5206\u7c7b\u7814\u7a76", "auth": ["\u6f58\u5b87\u7545"], "publish": " \u66a8\u5357\u5927\u5b66" }, { "libinfo": [{ "status": "\u9986\u5185\u9605\u89c8", "index": "TP/M2018/40", "location": "\u672c\u90e8\u516d\u697c\u672c\u6821\u535a\u7855\u5b66\u4f4d\u8bba\u6587" }], "name": "\u5de5\u4e1a\u673a\u5668\u4eba\u63a7\u5236\u8f6f\u4ef6\u7684\u6d4b\u8bd5\u7528\u4f8b\u5305\u7814\u7a76\u4e0e\u5e94\u7528", "auth": ["\u5f20\u66fc"], "publish": " \u66a8\u5357\u5927\u5b66" }, { "libinfo": [{ "status": "\u9986\u5185\u9605\u89c8", "index": "H/M2018/93", "location": "\u672c\u90e8\u516d\u697c\u672c\u6821\u535a\u7855\u5b66\u4f4d\u8bba\u6587" }], "name": "\u5e7f\u5dde\u9ad8\u6821\u7559\u5b66\u751f\u6c49\u8bed\u5b66\u4e60\u8f6f\u4ef6\u4f7f\u7528\u60c5\u51b5\u8c03\u67e5", "auth": ["\u5353\u5c11\u83b2"], "publish": " \u66a8\u5357\u5927\u5b66" }, { "libinfo": [{ "status": "\u9986\u5185\u9605\u89c8", "index": "F/M2018/560", "location": "\u672c\u90e8\u516d\u697c\u672c\u6821\u535a\u7855\u5b66\u4f4d\u8bba\u6587" }], "name": "\u8f6f\u4ef6\u5f00\u53d1\u5de5\u4f5c\u91cf\u9884\u4f30\u65b9\u6cd5\u7814\u7a76", "auth": ["\u5d14\u7433"], "publish": " \u66a8\u5357\u5927\u5b66" }, { "libinfo": [{ "status": "\u5728\u67b6\u4e0a", "index": "TN929.5/201826", "location": "\u672c\u90e8\u56db\u697c\u4e2d\u6587\u56fe\u4e66\u501f\u9605\u533a" }, { "status": "\u5728\u67b6\u4e0a", "index": "TN929.5/201826", "location": "\u756a\u79ba\u6821\u533a\u56fe\u4e66\u9986\u501f\u9605\u533a" }, { "status": "\u5728\u67b6\u4e0a", "index": "TN929.5/117", "location": "\u73e0\u6d77\u6821\u533a\u56db\u81f3\u4e94\u697c\u81ea\u79d1\u56fe\u4e66\u501f\u9605\u533a" }], "name": "\u9762\u54115G\u79fb\u52a8\u901a\u4fe1\u7684\u8f6f\u4ef6\u65e0\u7ebf\u7535\u5e73\u53f0\u539f\u578b\u9a8c\u8bc1\u4e0e\u5f00\u53d1", "auth": ["\u9633\u6790...[\u7b49]"], "publish": " \u7535\u5b50\u5de5\u4e1a\u51fa\u7248\u793e" }, { "libinfo": [], "name": "\u6784\u4ef6\u5316\u8f6f\u4ef6\u52a8\u6001\u66f4\u65b0\u4e0e\u9a8c\u8bc1\u6280\u672f", "auth": ["\u5f90\u5c0f\u8f89"], "publish": " \u5929\u6d25\u5927\u5b66\u51fa\u7248\u793e" }, { "libinfo": [], "name": "UML\u8f6f\u4ef6\u5efa\u6a21\u9879\u76ee\u5316\u6559\u7a0b", "auth": ["\u5218\u4e2d\u80dc\u4e3b"], "publish": " \u4e2d\u56fd\u94c1\u9053\u51fa\u7248\u793e" }, { "libinfo": [], "name": "\u8f6f\u4ef6\u6210\u672c\u5ea6\u91cf\u53ca\u9020\u4ef7\u5206\u6790", "auth": ["\u674e\u534e\u5317\u7b49"], "publish": " \u7535\u5b50\u5de5\u4e1a\u51fa\u7248\u793e" }, { "libinfo": [{ "status": "\u5728\u67b6\u4e0a", "index": "O212.7-39/20181", "location": "\u672c\u90e8\u4e09\u697c\u4e2d\u6587\u65b0\u4e66\u501f\u9605\u533a" }], "name": "\u975e\u53c2\u6570\u7edf\u8ba1\u4e0eSPSS/R/SAS\u8f6f\u4ef6\u5e94\u7528", "auth": ["\u8463\u5bd2\u9752\u7f16"], "publish": " \u4e2d\u56fd\u7edf\u8ba1\u51fa\u7248\u793e" }, { "libinfo": [{ "status": "\u5728\u67b6\u4e0a", "index": "TP311.55/20183", "location": "\u672c\u90e8\u4e09\u697c\u4e2d\u6587\u65b0\u4e66\u501f\u9605\u533a" }, { "status": "\u5728\u67b6\u4e0a", "index": "TP311.55/20183", "location": "\u756a\u79ba\u6821\u533a\u56fe\u4e66\u9986\u501f\u9605\u533a" }], "name": "\u8f6f\u4ef6\u6d4b\u8bd5\u8fdb\u9636\u4e4b\u8def", "auth": ["\u4f55\u98de"], "publish": " \u7535\u5b50\u5de5\u4e1a\u51fa\u7248\u793e" }, { "libinfo": [], "name": "ANSYS AQWA\u8f6f\u4ef6\u5165\u95e8\u4e0e\u63d0\u9ad8", "auth": ["\u9ad8\u5dcd\u4e3b"], "publish": " \u4e2d\u56fd\u6c34\u5229\u6c34\u7535\u51fa\u7248\u793e" }]'
  return JSON.parse(teststring)
  // !important 从服务器接收数据无需JSON.parse，因为wx.request 的 dataType默认为 json，会在获得数据后自动进行一次JSONparse。
}
