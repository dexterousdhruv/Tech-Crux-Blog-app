function checkPasswordStrength(password) {
  // Example criteria for a strong password
  if (password.length < 8) {
      return "Password too short";
  }
  if (!/[A-Z]/.test(password)) {
      return "Password must include an uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
      return "Password must include a lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
      return "Password must include a number";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must include a special character";
  }
  return "Password is strong";
}

export { checkPasswordStrength }