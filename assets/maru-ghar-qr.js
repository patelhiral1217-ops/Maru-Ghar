/* QR helper. qrcode-generator is loaded locally by download.html. */
(function (root) {
  'use strict';
  root.MaruQR = function (value) {
    if (typeof root.qrcode !== 'function') throw new Error('QR લાઇબ્રેરી લોડ થઈ નથી. ઇન્ટરનેટ કનેક્શન તપાસો.');
    var qr = root.qrcode(0, 'M');
    qr.addData(String(value || ''));
    qr.make();
    var n = qr.getModuleCount(), matrix = [];
    for (var r = 0; r < n; r++) {
      var row = [];
      for (var c = 0; c < n; c++) row.push(qr.isDark(r, c));
      matrix.push(row);
    }
    return matrix;
  };
})(window);
