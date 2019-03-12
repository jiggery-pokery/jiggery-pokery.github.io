function checkIsIE() {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}
var isIE = checkIsIE();
if (isIE && isIE < 9) {
  throw new Error("Something went badly wrong!");
};