import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Helper component to redirect component-name URLs to proper kebab-case routes
export function AdminDashboardRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin", { replace: true });
  }, [navigate]);

  return null;
}

export function AdminDashboardSimpleRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin-simple", { replace: true });
  }, [navigate]);

  return null;
}

export function AdminTestRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin-test", { replace: true });
  }, [navigate]);

  return null;
}

export function SmsTestRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/sms-test", { replace: true });
  }, [navigate]);

  return null;
}
