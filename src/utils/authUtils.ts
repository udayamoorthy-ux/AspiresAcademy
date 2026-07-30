export const isOwnerEmail = (email: string): boolean => {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return (
    clean === 'udayamoorthy@gmail.com' ||
    clean === 'udayamoorthy2gmail.com' ||
    clean.startsWith('udayamoorthy2gmail') ||
    clean.replace('2gmail', '@gmail') === 'udayamoorthy@gmail.com'
  );
};

export const OWNER_PASSCODES = ['ASPIRES2026', 'OWNER2026', 'UDAYA2026', '7890'];

export const verifyOwnerPasscode = (passcode: string): boolean => {
  if (!passcode) return false;
  return OWNER_PASSCODES.includes(passcode.trim().toUpperCase());
};
