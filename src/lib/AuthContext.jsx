import { createContext, useState, useEffect, useContext, useRef } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,          setUser]          = useState(null);
  const [profile,       setProfile]       = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked,   setAuthChecked]   = useState(false);
  const [authError,     setAuthError]     = useState(null);
  const isMounted = useRef(true);

  const fetchProfile = async (authUser) => {
    if (!authUser) return null;
    try {
      console.log("📋 Fetching profile for:", authUser.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();
      console.log("📋 Profile result:", data, "Error:", error?.message);
      if (error) return null;
      return data;
    } catch (err) {
      console.error("Profile fetch exception:", err);
      return null;
    }
  };

  useEffect(() => {
    isMounted.current = true;

    const boot = async () => {
      try {
        if (window.location.pathname === "/auth/callback") return;

        const { data: { session } } = await supabase.auth.getSession();
        console.log("🔑 Boot session:", session?.user?.email);

        if (session?.user && isMounted.current) {
          const prof = await fetchProfile(session.user);
          if (isMounted.current) {
            setUser(session.user);
            setProfile(prof);
          }
        }
      } catch (err) {
        if (isMounted.current) setAuthError(err);
      } finally {
        if (isMounted.current) {
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      }
    };

    boot();

    // ✅ No async inside onAuthStateChange — fetchProfile runs in setTimeout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔄 Auth event:", event, session?.user?.email);
        if (!isMounted.current) return;

        if (session?.user) {
          setUser(session.user);
          setTimeout(async () => {
            const prof = await fetchProfile(session.user);
            console.log("✅ Got profile:", prof);
            if (isMounted.current) {
              setProfile(prof);
              setIsLoadingAuth(false);
              setAuthChecked(true);
            }
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      }
    );

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.href = "/";
  };

  const isAuthenticated = !!user && !!profile;
  const isAdmin         = profile?.role === "admin";

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAuthenticated,
      isAdmin,
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authChecked,
      authError,
      appPublicSettings: null,
      logout,
      login:           () => {},
      navigateToLogin: () => { window.location.href = "/login"; },
      checkUserAuth:   () => {},
      checkAppState:   () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
