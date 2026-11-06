import jwt from 'jsonwebtoken';
import { findUserById } from '../services/dataService.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'campusconnect_jwt_default_secret_key'
    );

    req.user = await findUserById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or expired. Please log in again.',
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Administrator privileges required.',
  });
};

export const studentOnly = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Student access only.',
  });
};
