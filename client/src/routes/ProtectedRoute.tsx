import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: React.ReactNode;
  allowedRoles?: (
    | "CITIZEN"
    | "DA"
    | "PATWARI"
    | "TEHSILDAR"
    | "ADMIN"
  )[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: Props) {
  const {
    isAuthenticated,
    user,
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  if (
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    switch (user.role) {
      case "CITIZEN":
        return (
          <Navigate
            to="/dashboard"
            replace
          />
        );

      case "DA":
      case "PATWARI":
      case "TEHSILDAR":
        return (
          <Navigate
            to="/officer/dashboard"
            replace
          />
        );

      case "ADMIN":
        return (
          <Navigate
            to="/admin/dashboard"
            replace
          />
        );

      default:
        return (
          <Navigate
            to="/"
            replace
          />
        );
    }
  }

  return <>{children}</>;
}