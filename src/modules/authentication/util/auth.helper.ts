import { jwtDecode, JwtPayload } from "jwt-decode";
import { toast } from "react-toastify";

// Helper function to decode the JWT
const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Invalid token:", error);
    toast.error("Invalid token. Please login again!");
    return null;
  }
};

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return false;
  }

  const decodedToken = decodeToken(token);
  if (!decodedToken || !decodedToken.exp) {
    return false;
  }

  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
};

// Get the subject (sub) from the token
export const getSub = (): string => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return "Unknown User";
  }

  const decodedToken = decodeToken(token);
  return decodedToken && decodedToken.sub ? decodedToken.sub : "Unknown User";
};
