const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'learnup-dev-secret';

function validateSignupInput({ name, email, password }) {
  if (!name || !name.trim()) {
    throw new Error('Name is required');
  }

  if (!email || !email.trim()) {
    throw new Error('Email is required');
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  return true;
}

function createAuthToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
}

module.exports = { validateSignupInput, createAuthToken, JWT_SECRET };
