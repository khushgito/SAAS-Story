import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export function generateToken(userId: string) {
  return sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return verify(token, process.env.JWT_SECRET!) as { userId: string };
  } catch (error) {
    return null;
  }
}

export async function createUser(email: string, password: string) {
  const client = await clientPromise;
  const db = client.db();

  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);
  const result = await db.collection('users').insertOne({
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  return { id: result.insertedId.toString(), email };
}

export async function getUserById(id: string) {
  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
  if (!user) return null;

  return { id: user._id.toString(), email: user.email };
}