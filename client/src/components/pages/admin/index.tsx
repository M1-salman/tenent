import AdminContent from "./AdminContent";
import AdminLogin from "./AdminLogin";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

const AdminAuthCheck = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const checkAdminStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${serverUrl}/api/admin/check-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        toast.error("Admin access required");
      }
    } catch (error) {
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin onLoginSuccess={checkAdminStatus} />;
  }

  return <AdminContent />;
};

export default AdminAuthCheck;
