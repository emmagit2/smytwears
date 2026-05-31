import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handle = async () => {
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );
      console.log("✅ Exchange session:", session?.user?.email, error);
      if (error) {
        navigate("/login?error=" + encodeURIComponent(error.message), { replace: true });
        return;
      }
      if (session) {
        const isAdmin = session.user?.app_metadata?.role === "admin" ||
                        session.user?.email === "basseyanikan22@gmail.com";
        navigate(isAdmin ? "/admin" : "/", { replace: true });
      }
    };
    handle();
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}
