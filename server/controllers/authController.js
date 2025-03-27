const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    
    const verificationToken = user.getVerificationToken();
    await user.save({ validateBeforeSave: false });

    
    const verificationUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/verifyemail/${verificationToken}`;

    const message = `You are receiving this email because you (or someone else) has requested to verify your account. Please make a GET request to: \n\n ${verificationUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email verification token',
        message,
      });

      res.status(200).json({
        success: true,
        data: 'Email sent successfully',
      });
    } catch (err) {
      console.log(err);
      user.verificationToken = undefined;
      user.verificationTokenExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (err) {
    next(err);
  }
};


exports.verifyEmail = async (req, res, next) => {

  const verificationToken = crypto
    .createHash('sha256')
    .update(req.params.verificationToken)
    .digest('hex');

  try {
    const user = await User.findOne({
      verificationToken,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }

    
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();


    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};


exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

 
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

 
  if (!user.isVerified) {
    return next(new ErrorResponse('Please verify your email first', 401));
  }

  
  sendTokenResponse(user, 200, res);
};


exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};

const sendTokenResponse = (user, statusCode, res) => {
 
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};