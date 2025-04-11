import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ForgotPasswordPage from "./modules/authentication/pages/ForgotPasswordPage";
import RegisterPage from "./modules/authentication/pages/RegisterPage";
import LoginPage from "./modules/authentication/pages/LoginPage";
import ErrorNotFoundpage from "./modules/common/pages/ErrorNotFoundpage";
import ImageGenerationPage from "./modules/generate-img/ImageGenerationPage";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./modules/authentication/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          
          {/* core image-gen page */}
          <Route
            path="/"
            element={<ProtectedRoute element={<ImageGenerationPage />} />}
          />

          {/* Authenticaton pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* error & 404 pages */}
          <Route path="/404" element={<ErrorNotFoundpage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
