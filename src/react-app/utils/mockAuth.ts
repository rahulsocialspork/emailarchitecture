export interface MockUser { email: string }

const USERS_KEY = 'mock_users_v1';
const CURRENT_KEY = 'mock_current_user_v1';

function readUsers(): Record<string, string> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string,string>){
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register(email: string, password: string): { ok: boolean; error?: string } {
  const users = readUsers();
  if (users[email]) return { ok: false, error: 'User already exists' };
  users[email] = password;
  writeUsers(users);
  // set current user
  localStorage.setItem(CURRENT_KEY, JSON.stringify({ email }));
  return { ok: true };
}

export function login(email: string, password: string): { ok: boolean; error?: string } {
  const users = readUsers();
  if (!users[email]) return { ok: false, error: 'User not found' };
  if (users[email] !== password) return { ok: false, error: 'Invalid credentials' };
  localStorage.setItem(CURRENT_KEY, JSON.stringify({ email }));
  return { ok: true };
}

export function logout() {
  localStorage.removeItem(CURRENT_KEY);
}

export function getCurrentUser(): MockUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
