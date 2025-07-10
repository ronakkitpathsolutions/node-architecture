import { createApiResponse, asyncHandler } from '../utils/helper.js';
import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/mailer.js';
import { generateRefreshToken } from '../utils/refreshToken.js';

export const login = asyncHandler(async (req, res) => {
  // Get validated data from middleware
  const { email, password } = req.validatedData;

  // 2. Find user by email with role
  const user = await User.findByEmailWithRole(email);

  if (!user) {
    return res
      .status(401)
      .json(createApiResponse(false, 'Invalid username or password'));
  }

  // 3. Check if user is active
  if (!user.is_active) {
    return res
      .status(403)
      .json(
        createApiResponse(
          false,
          'Account is not activated. Please verify your email.'
        )
      );
  }

  // 4. Validate password
  const isPasswordValid = await user.validatePassword(password);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json(createApiResponse(false, 'Invalid username or password'));
  }

  // 5. Generate JWT token
  const tokenPayload = {
    id: user.id,
    email: user.email,
    role_id: user.role_id,
    role_name: user.role?.name,
    is_active: user.is_active,
  };

  const token = generateToken(tokenPayload);

  // 6. Return success response with token
  return res
    .status(200)
    .json(createApiResponse(true, 'Login successful', token));
}, 'Login failed');

export const register = asyncHandler(async (req, res) => {
  // Get validated data from middleware
  const { email } = req.validatedData;
  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res
      .status(409)
      .json(createApiResponse(false, 'User already exists with this email'));
  }

  // Generate refresh token
  const refreshToken = generateRefreshToken();
  // Create user (Zod + Sequelize hooks will handle password hash, etc.)
  const user = await User.create({
    ...req.validatedData,
    refresh_token: refreshToken,
  });

  // Fetch the created user with role information to get role name
  const userWithRole = await User.findByEmailWithRole(user.email);

  // Send verification email
  const verificationUrl = `http://localhost:3000/verify?refresh_token=${refreshToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your account',
    html: `<p>Click <a target="_blank" href="${verificationUrl}">here</a> to verify your account.</p>`,
  });

  // Generate JWT token
  const tokenPayload = {
    id: userWithRole.id,
    email: userWithRole.email,
    role_id: userWithRole.role_id,
    role_name: userWithRole.role?.name,
    is_active: userWithRole.is_active,
  };

  const token = generateToken(tokenPayload);

  // Return success response with token
  return res
    .status(201)
    .json(
      createApiResponse(
        true,
        'Registration successful. Please check your email to verify your account.',
        token
      )
    );
}, 'Registration failed');

export const forgotPassword = asyncHandler(async (req, res) => {
  // Get validated data from middleware
  const { email } = req.validatedData;
  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (!existingUser) {
    return res
      .status(404)
      .json(createApiResponse(false, 'User does not exist with this email'));
  }

  // Generate new refresh token
  const refreshToken = generateRefreshToken();
  await existingUser.update({ refresh_token: refreshToken });
  // Send reset password email
  const resetUrl = `http://localhost:3000/reset-password?refresh_token=${refreshToken}`;
  await sendEmail({
    to: existingUser.email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });
  return res
    .status(200)
    .json(createApiResponse(true, 'Password reset email sent successfully'));
}, 'Failed to send password reset email');

export const resetPassword = asyncHandler(async (req, res) => {
  // Get validated data from middleware
  const { refresh_token, newPassword } = req.validatedData;

  // Find user by refresh token
  const user = await User.findOne({ where: { refresh_token } });
  if (!user) {
    return res
      .status(404)
      .json(createApiResponse(false, 'User not found or invalid token'));
  }

  // Update user's password
  user.password = newPassword;
  user.refresh_token = null;
  await user.save();

  // Generate JWT token
  const userWithRole = await User.findByEmailWithRole(user.email);
  const tokenPayload = {
    id: userWithRole.id,
    email: userWithRole.email,
    role_id: userWithRole.role_id,
    role_name: userWithRole.role?.name,
    is_active: userWithRole.is_active,
  };

  const token = generateToken(tokenPayload);

  return res
    .status(200)
    .json(createApiResponse(true, 'Password reset successful', token));
}, 'Password reset failed');

export const getUserProfile = async () => {
  // Function logic will be implemented here
};

export const verifyUser = asyncHandler(async (req, res) => {
  const { refresh_token } = req.query;

  if (!refresh_token) {
    return res
      .status(400)
      .json(createApiResponse(false, 'Verification token is required'));
  }

  // Find user by refresh token
  const user = await User.findOne({ where: { refresh_token } });

  if (!user) {
    return res
      .status(404)
      .json(createApiResponse(false, 'User not found or invalid token'));
  }

  // Update user to be active and clear refresh token
  await user.update({ is_active: true, refresh_token: null });
  const userWithRole = await User.findByEmailWithRole(user.email);

  // Generate JWT token
  const tokenPayload = {
    id: userWithRole.id,
    email: userWithRole.email,
    role_id: userWithRole.role_id,
    role_name: userWithRole.role?.name,
    is_active: userWithRole.is_active,
  };

  const verifiedToken = generateToken(tokenPayload);

  return res
    .status(200)
    .json(
      createApiResponse(
        true,
        'User verified successfully. Account is now active.',
        verifiedToken
      )
    );
}, 'Verification failed');

export const resendVerification = asyncHandler(async (req, res) => {
  // Get validated data from middleware
  const { email } = req.validatedData;
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(404).json(createApiResponse(false, 'User not found'));
  }
  if (user.is_active) {
    return res
      .status(400)
      .json(createApiResponse(false, 'User is already verified'));
  }
  // Generate new refresh token
  const refreshToken = generateRefreshToken();
  await user.update({ refresh_token: refreshToken });
  // Send verification email
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?refresh_token=${refreshToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your account',
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your account.</p>`,
  });
  return res
    .status(200)
    .json(createApiResponse(true, 'Verification email sent successfully'));
}, 'Failed to resend verification');
