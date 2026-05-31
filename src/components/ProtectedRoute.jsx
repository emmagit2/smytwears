import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
  </div>
);

export default function ProtectedRoute({
  children,
  fallback               = <DefaultFallback />,
  unauthenticatedElement = <Navigate to="/login" replace />,
  requireAdmin           = true,
}) {
  const { user, isAuthenticated, isAdmin, isLoadingAuth, authChecked } = useAuth();

  // Still checking session or profile still loading
  if (isLoadingAuth || !authChecked || (user && !isAuthenticated)) return fallback;

  // Not logged in → redirect to login
  if (!isAuthenticated) return unauthenticatedElement;

  // Logged in but not admin → show error
  if (requireAdmin && !isAdmin) return <UserNotRegisteredError />;

  // ✅ Render children
  return children;
}