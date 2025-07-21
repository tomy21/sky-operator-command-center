// import { cookies } from 'next/headers';
// import jwt from 'jsonwebtoken';
// import { User } from '@/types/auth';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

// export interface JWTPayload {
//     userId: string;
//     email: string;
//     iat?: number;
//     exp?: number;
// }

// export function verifyToken(token: string): JWTPayload | null {
//     try {
//         return jwt.verify(token, JWT_SECRET) as JWTPayload;
//     } catch {
//         return null;
//     }
// }

// export function generateToken(payload: { userId: string; email: string }): string {
//     return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
// }

// export async function isAuthenticated(): Promise<boolean> {
//     try {
//         const cookieStore = await cookies();
//         const token = cookieStore.get('auth-token')?.value;
//         return !!token; // Return true jika token ada, false jika tidak
//     } catch (error) {
//         console.error('Error checking authentication:', error);
//         return false;
//     }
// }

// export async function getServerSession(): Promise<User | null> {
//     try {
//         const cookieStore = await cookies();
//         const token = cookieStore.get('auth-token')?.value;
        
//         if (!token) return null;
        
//         const payload = verifyToken(token);
//         if (!payload) return null;
        
//         return {
//             id: payload.userId,
//             username: payload.email,
//             role: 'user'
//         };
//     } catch (error) {
//         console.error('Error getting server session:', error);
//         return null;
//     }
// }

// export async function getBasicSession(): Promise<{ hasToken: boolean }> {
//     try {
//         const cookieStore = await cookies();
//         const token = cookieStore.get('auth-token')?.value;
        
//         return { hasToken: !!token };
//     } catch (error) {
//         console.error('Error getting basic session:', error);
//         return { hasToken: false };
//     }
// }