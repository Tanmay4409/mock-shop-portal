import { NextResponse } from 'next/server';

/**
 * Enterprise Mock Auth Route Handler
 * 
 * TRIAL SCENARIO 1 (Live Demo with Mentor):
 * Baseline (Working): Accepts email 'admin@pes.edu' with password 'password'.
 * Breaking Change: Change password to 'wrong-pass' or change email, then commit:
 *   git commit -am "feat(auth): rotate JWT signing keys and restrict access credentials"
 *   git push origin main
 * Result: Users get 401 Unauthorized, creating an incident for it-incident-system.
 */

// Baseline valid credentials
const VALID_CREDENTIALS = {
  email: 'admin@pes.edu',
  password: 'password',
};
//demo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Simulate authentication check
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
      const secret = process.env.JWT_SECRET || 'it-mock-secret-key-2026';
      
      const token = `mock-jwt-${Buffer.from(email).toString('base64')}-${Date.now()}`;
      
      return NextResponse.json({
        success: true,
        token,
        user: {
          email,
          role: 'IT_Administrator',
          name: 'Portal Administrator',
        },
      }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Unauthorized: Invalid email or password' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Bad Request: Malformed JSON payload' },
      { status: 400 }
    );
  }
}
