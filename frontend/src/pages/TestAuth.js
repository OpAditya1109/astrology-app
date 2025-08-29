import React from "react";
import { useAuth } from "../Context/AuthContext";

export default function TestAuth() {
  const { userId, token } = useAuth();

  console.log("Auth userId:", userId, "Token:", token);

  return <div>Check console for auth info</div>;
}
