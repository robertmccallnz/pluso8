// islands/interfaces/AuthComponent.tsx
/** @jsxImportSource preact */
import { useState } from "preact/hooks";
import { tw } from "twind";
import { COLORS } from "../../lib/constants/styles.ts";

interface AuthComponentProps {
  onAuth: () => void;
}

export default function AuthComponent({ onAuth }: AuthComponentProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      // For demo purposes, automatically authenticate
      onAuth();
    } catch (err) {
      setError('Authentication failed');
    }
  };

  return (
    <div class={tw`max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg`}>
      <h2 class={tw`text-2xl font-bold mb-6 text-center`}>
        {isLogin ? 'Login' : 'Sign Up'} to Jeff Legal
      </h2>
      
      <form onSubmit={handleSubmit} class={tw`space-y-4`}>
        <div>
          <label class={tw`block text-sm font-medium text-gray-700`}>Email</label>
          <input
            type="email"
            value={email}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            class={tw`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:(outline-none ring-2 ring-blue-500)`}
            required
          />
        </div>

        <div>
          <label class={tw`block text-sm font-medium text-gray-700`}>Password</label>
          <input
            type="password"
            value={password}
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            class={tw`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:(outline-none ring-2 ring-blue-500)`}
            required
          />
        </div>

        {!isLogin && (
          <div>
            <label class={tw`block text-sm font-medium text-gray-700`}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onInput={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
              class={tw`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:(outline-none ring-2 ring-blue-500)`}
              required
            />
          </div>
        )}

        {error && (
          <div class={tw`text-red-500 text-sm`}>
            {error}
          </div>
        )}

        <button
          type="submit"
          class={tw`w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:(outline-none ring-2 ring-blue-500 ring-offset-2)`}
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>

        <div class={tw`text-center mt-4`}>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            class={tw`text-sm text-blue-500 hover:text-blue-600`}
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </button>
        </div>
      </form>
    </div>
  );
}