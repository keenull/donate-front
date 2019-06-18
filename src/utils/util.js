/**
 * 时间戳
 * @param {*} timestamp  时间戳
 */
const timestampToTime = (timestamp) => {
  let date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  let D =
      (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  let h =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':'
  let s =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}

/**
 * 将'2018-05-19T08:04:52.000+0000'这种格式的时间转化为正常格式
 * @param time
 */
const timeFormat = (time) => {
  var d = new Date(time)
  var year = d.getFullYear()
  var month = d.getMonth() + 1
  var day = d.getDate()
  var hh = d.getHours()
  var mm = d.getMinutes()
  var ss = d.getSeconds()
  var clock = year + '-'
  if (month < 10) clock += '0'
  clock += month + '-'
  if (day < 10) clock += '0'
  clock += day + ' '
  if (hh < 10) clock += '0'
  clock += hh + ':'
  if (mm < 10) clock += '0'
  clock += mm + ':'
  if (ss < 10) clock += '0'
  clock += ss
  return clock
}

/**
 * 格式化日期代码
 * @param {Date} data
 * @param {String} format
 */
export function dateFormate(data, format) {
  let date = new Date(data);
  let args = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
    S: date.getMilliseconds()
  };
  if (/(y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (var i in args) {
    var n = args[i];
    if (new RegExp('(' + i + ')').test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? n : ('00' + n).substr(('' + n).length)
      );
  }
  return format;
}

/**
 * 设置cookie
 **/
const setCookie = (name, value, m) => {
  let date = new Date()
  date.setTime(date.getTime() + (m * 1000))
  document.cookie = name + '=' + value + ';expires=' + date.toGMTString()
}

/**
 * 获取cookie
 **/
const getCookie = (name) => {
  var arg = name + '='
  var alen = arg.length
  var clen = document.cookie.length
  var i = 0
  while (i < clen) {
    var j = i + alen
    if (document.cookie.substring(i, j) === arg) return getCookieVal(j)
    i = document.cookie.indexOf(' ', i) + 1
    if (i === 0) break
  }
  return null
}

const getCookieVal = (offset) => {
  var endstr = document.cookie.indexOf(';', offset)
  if (endstr === -1) endstr = document.cookie.length
  return unescape(document.cookie.substring(offset, endstr))
}

/**
 * 删除cookie
 **/
const delCookie = (name) => {
  var date = new Date()
  date.setTime(date.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + date.toGMTString()
  }
}

/**
 * 导出
 **/
export {
  timestampToTime,
  timeFormat,
  setCookie,
  getCookie,
  delCookie
}
