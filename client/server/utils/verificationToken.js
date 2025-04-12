const crypto = require('crypto');


module.exports = {
  
  getVerificationToken() {
    const verificationToken = crypto.randomBytes(20).toString('hex');

    this.verificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    this.verificationTokenExpire = Date.now() + 10 * 60 * 1000; 

    return verificationToken;
  },

  
  getResetPasswordToken() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 

    return resetToken;
  },

  
  getSignedJwtToken() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
  }
};