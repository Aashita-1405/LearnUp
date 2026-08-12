const test = require('node:test');
const assert = require('node:assert');

const { validateSignupInput, createAuthToken } = require('../src/auth');

test('validateSignupInput rejects missing name', () => {
  assert.throws(
    () => validateSignupInput({ name: '', email: 'user@example.com', password: 'secret123' }),
    /name/i
  );
});

test('validateSignupInput rejects short passwords', () => {
  assert.throws(
    () => validateSignupInput({ name: 'Sample User', email: 'user@example.com', password: '123' }),
    /at least 6 characters/i
  );
});

test('createAuthToken returns a non-empty JWT-like string', () => {
  const token = createAuthToken({ id: 7, email: 'user@example.com' });
  assert.ok(typeof token === 'string');
  assert.ok(token.length > 20);
});
