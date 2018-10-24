function getBrowser () {
  var userAgent = navigator.userAgent //取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf('Opera') > -1 //判断是否Opera浏览器
  var isIE = window.ActiveXObject || 'ActiveXObject' in window
  var isEdge = userAgent.indexOf('Edge') > -1 //判断是否IE的Edge浏览器
  var isFF = userAgent.indexOf('Firefox') > -1 //判断是否Firefox浏览器
  var isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1 //判断是否Safari浏览器
  var isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1&&!isEdge //判断Chrome浏览器

  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+)')
    reIE.test(userAgent)
    var fIEVersion = parseFloat(RegExp['$1'])
    if(userAgent.indexOf('MSIE 6.0')!=-1){
      return 'IE6'
    }else if (fIEVersion == 7)
    { return 'IE7'}
    else if (fIEVersion == 8)
    { return 'IE8'}
    else if (fIEVersion == 9)
    { return 'IE9'}
    else if (fIEVersion == 10)
    { return 'IE10'}
    else if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)) {
      return 'IE11'
    }
    else
    { return '0' } //IE版本过低
  }

  if (isFF) { return 'FF' }
  if (isOpera) { return 'Opera' }
  if (isSafari) { return 'Safari' }
  if (isChrome) { return 'Chrome' }
  if (isEdge) { return 'Edge' }
}

if (getBrowser().indexOf('IE') > -1 || getBrowser().indexOf('Edge') > -1) {
  document.getElementById('app').innerHTML = '<h1>住手</h1><p style="letter-spacing: .1rem">很遺憾此頁面不支援 Internet Explorer 和 Edge </p> <a href="https://www.google.com/intl/zh-TW_ALL/chrome/" target="_blank" style="color: #30c7ec; letter-spacing: .1rem;">你有更好的選擇例如 Chrome</a>'
}
