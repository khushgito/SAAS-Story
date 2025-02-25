import { AuthForm } from '@/components/auth/auth-form';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Imagitime</h1>
        <AuthForm />
      </div>
    </div>
  );
}