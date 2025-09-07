import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl bg-white/80 backdrop-blur">
        
        {/* Left Side - Clerk Sign Up */}
        <div className="w-1/2 flex items-center justify-center p-10">
          <SignUp 
            routing="hash" 
            redirectUrl="/role-selection"
            afterSignUpUrl="/role-selection"
          />
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-emerald-50">
          <img
            src="/login-illustration.jpg"
            alt="Register Illustration"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
