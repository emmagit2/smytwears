import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, authChecked } = useAuth();

  useEffect(() => {
    supabase.auth.exchangeCodeForSession(window.location.href)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin" : "/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [authChecked, isAuthenticated, isAdmin, navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}
