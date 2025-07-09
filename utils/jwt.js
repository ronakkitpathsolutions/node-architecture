import jwt from 'jsonwebtoken';
import { ENV } from '../config/index.js';

export const generateToken = (payload, expiresIn = ENV.JWT_EXPIRATION) => {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Payload must be a valid object');
    }

    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn,
      issuer: 'node-practice-app',
      audience: 'node-practice-users',
    });
    return token;
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

export const verifyToken = token => {
  try {
    if (!token) {
      throw new Error('Token is required');
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET, {
      issuer: 'node-practice-app',
      audience: 'node-practice-users',
    });

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Token not active yet');
    }
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

export const generateRefreshToken = (payload, expiresIn = '7d') => {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Payload must be a valid object');
    }

    const refreshToken = jwt.sign(
      { ...payload, type: 'refresh' },
      ENV.JWT_SECRET,
      {
        expiresIn,
        issuer: 'node-practice-app',
        audience: 'node-practice-users',
      }
    );

    return refreshToken;
  } catch (error) {
    throw new Error(`Refresh token generation failed: ${error.message}`);
  }
};

export const decodeToken = token => {
  try {
    if (!token) {
      return null;
    }

    return jwt.decode(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = token => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

export const getTokenExpiration = token => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return null;
    }

    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
};

export default {
  generateToken,
  verifyToken,
  generateRefreshToken,
  decodeToken,
  isTokenExpired,
  getTokenExpiration,
};
