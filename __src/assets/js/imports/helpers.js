export function isTrident() {
  var trident = false;

  if (navigator)
  {
    var userAgent = navigator.userAgent;
    var regEx = new RegExp("Trident/([0-9]{1,}[\.0-9]{0,})");

    if (regEx.exec(userAgent) != null) {
      //version = parseFloat(RegExp.$1);
      trident = true;
    }
  }

  return trident;
}