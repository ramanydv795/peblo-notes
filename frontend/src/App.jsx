import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NoteEditor from "./pages/NoteEditor";
import SharedNote from "./pages/SharedNote";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("peblo_token");
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shared/:shareId" element={<SharedNote />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/notes/:id" element={
          <ProtectedRoute><NoteEditor /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}