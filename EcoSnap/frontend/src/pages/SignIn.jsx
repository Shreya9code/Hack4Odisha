import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl bg-white/80 backdrop-blur">
        
        {/* Left Side - Clerk Sign In */}
        <div className="w-1/2 flex items-center justify-center p-10">
          <SignIn 
            routing="hash" 
            redirectUrl="/dashboard"
            afterSignInUrl="/dashboard"
          />
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-emerald-50">
          <img
            src="/login-illustration.jpg"
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default SignInPage;