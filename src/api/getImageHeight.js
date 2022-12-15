const imgReg = /<img.*?(?:>|\/>)/gi
const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i

function heightFun (info, fun) {
  var imgList = info.match(imgReg)
  if (imgList) {
    imgList.map(img => {
      var newImg = new Image()
      newImg.onload = () => {
        var strIdx = info.indexOf(img.match(srcReg)[0])
        var subStr = info.substring(strIdx, strIdx + img.match(srcReg)[0].length)
        info = info.replace(subStr, `height='${newImg.height / 2.5}px' ${subStr}`)
        fun(info)
      }
      newImg.src = img.match(srcReg)[1]
    })
  }
}

function getImageHeight (data) {
  var info = data.questionDescription
  heightFun(info, info => {
    data.questionDescription = info
  })
  data.answerList.map((a, idx, arr) => {
    var info = a.questionAnswer
    heightFun(info, info => {
      arr[idx].questionAnswer = info
    })
  })
}

export default {
  getImageHeight
}
