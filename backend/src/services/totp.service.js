const { authenticator } = require('otplib');
const qrcode = require('qrcode');

const generateTotpSecret = (adminName) => {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(adminName, 'JeevansathiAdmin', secret);
  return { secret, otpauth };
};

const generateQrCodeDataUrl = async (otpauthUrl) => {
  return await qrcode.toDataURL(otpauthUrl);
};

const verifyTotpToken = (token, secret) => {
  try {
    return authenticator.check(token, secret);
  } catch (error) {
    return false;
  }
};

module.exports = {
  generateTotpSecret,
  generateQrCodeDataUrl,
  verifyTotpToken,
};
