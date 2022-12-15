function getCookie (name) {
  var cookie = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
  return cookie ? cookie[2] : cookie
}

function setCookie (name, data) {
  var date_ = new Date()
  date_.setTime(date_.getTime() + 2 * 60 * 60 * 1000)
  document.cookie = name + '=' + data + ';expires=' + date_.toGMTString() + ';path=/;'
}

function removeCookie (name) {
  var date_ = new Date()
  date_.setTime(date_.getTime() - 1000)
  document.cookie = name + '=;expires=' + date_.toGMTString() + ';path=/;'
}

export default {
  getCookie,
  setCookie,
  removeCookie
}
