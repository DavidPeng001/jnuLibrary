// pages/room/room.js
Page({
  data: {
    startIndex: 0,
    endIndex: 12,    // 21-8 
    timeArray: ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
      "18:00", "19:00", "20:00", "21:00"], 
    // slice timeArray[] to get startTimeArray and endTimeArray
    startTimeArray: ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
      "18:00", "19:00", "20:00"],
    endTimeArray: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
      "18:00", "19:00", "20:00", "21:00"],
    contents: []
  },

  onLoad: function (options) {
  },

  startPickerChange: function(picker) {
    var index = parseInt(picker.detail.value)
    var timeArray = this.data.timeArray
    var newIndex = this.data.endIndex + (13 - this.data.endTimeArray.length - index)  //括号内为索引位移量
    // if(newIndex < 0) {
    //   newIndex = 0
    // }
    this.setData(
      {
        startIndex: index,
        endTimeArray: timeArray.slice(index + 1),
        endIndex: newIndex,
      },
    )
  },

  endPickerChange: function(picker) {
    var index = parseInt(picker.detail.value)
    var timeArray = this.data.timeArray
    this.setData(
      {
        endIndex: index,
        startTimeArray: timeArray.slice(0, index + 13 - this.data.endTimeArray.length + 1)
      }
    )
  },

  roomInfo: function() {
    var date = 3
    var startTime = this.data.startTimeArray[this.data.startIndex].slice(0,-3)  // - means reverse
    var endTime = this.data.endTimeArray[this.data.endIndex].slice(0, -3) 
    this.getRoomInfo(date, parseInt(startTime), parseInt(endTime))
  },

  getRoomInfo: function(date, start, end) {
    var that = this
    wx.request({
      url: 'https://davidp.top/api/roomsearch/',
      data: {
        date: date,
        start: start,
        end: end
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        if (res.statusCode == 200) {
          that.setData({
            contents: res.data
          })
        }
      },
      fail: function(res) {},
      
    })
  }
})