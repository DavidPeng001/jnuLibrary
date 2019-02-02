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
  }
})