/**
 * Email utility for KodBank
 * In development mode, emails are logged to console for testing
 */

export const sendVerificationEmail = async (
  email: string,
  username: string,
  token: string
) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  console.log('\n📧 Email Verification Link:');
  console.log(`To: ${email}`);
  console.log(`Username: ${username}`);
  console.log(`Verification URL: ${verificationUrl}`);
  console.log('---\n');
  return { success: true, message: 'Verification email logged to console' };
};

export const sendPasswordResetEmail = async (
  email: string,
  username: string,
  token: string
) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  console.log('\n📧 Password Reset Link:');
  console.log(`To: ${email}`);
  console.log(`Username: ${username}`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log(`⚠️ This link expires in 1 hour`);
  console.log('---\n');
  return { success: true, message: 'Password reset email logged to console' };
};
