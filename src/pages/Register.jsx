import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IMAGES } from "@/data/images";
import { supabase } from "@/lib/supabase";

export default function Register() {
  const [loading,      setLoading]     = useState(null);
  const [searchParams]                 = useSearchParams();
  const error                          = searchParams.get("error");

  const handleOAuth = async (provider) => {
    setLoading(provider);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (oauthError) {
      alert(oauthError.message);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">

        <div className="text-center mb-10">
          <img src={IMAGES.logo} alt="SMYT" className="h-12 mx-auto mb-6" />
          <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-2">Join the SMYT movement</p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {decodeURIComponent(error)}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handleOAuth("google")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 border border-border
              py-3.5 text-sm font-semibold hover:bg-muted/50 transition-colors
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading === "google"
              ? <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <GoogleIcon />}
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuth("facebook")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2]
              text-white py-3.5 text-sm font-semibold hover:bg-[#166FE5] transition-colors
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading === "facebook"
              ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <FacebookIcon />}
            Continue with Facebook
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground font-semibold underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.3C29.4 35.5 26.8 36 24 36c-5.3 0-9.6-3-11.3-7.4l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.3C42.1 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-3.9z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}