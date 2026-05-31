import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,          setUser]          = useState(null);
  const [profile,       setProfile]       = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked,   setAuthChecked]   = useState(false);
  const [authError,     setAuthError]     = useState(null);

  const fetchProfile = async (authUser) => {
    if (!authUser) return null;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();
    if (error) {
      console.error("Profile fetch error:", error.message);
      return null;
    }
    return data;
  };

  useEffect(() => {
    // Listen FIRST — catches SIGNED_IN from OAuth hash redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const prof = await fetchProfile(session.user);
          setUser(session.user);
          setProfile(prof);
          setAuthError(null);
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }

        if (event === "TOKEN_REFRESHED" && session?.user) {
          setUser(session.user);
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      }
    );

    // Then check for existing session (page refresh / returning user)
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const prof = await fetchProfile(session.user);
          setUser(session.user);
          setProfile(prof);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        setAuthError(err);
      } finally {
        setIsLoadingAuth(false);
        setAuthChecked(true);
      }
    };

    initAuth();
    return () => subscription.unsubscribe();
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