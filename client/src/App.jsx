import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import HomeScreen from "./pages/HomeScreen";
import { Toaster } from "react-hot-toast";
import { ProtectedRouteGuard } from "./components/ProtectedRouteGuard";
import { UnauthenticatedRouteGuard } from "./components/UnauthenticatedRouteGuard";
import FindTeacher from "./pages/FindTeacher";
import SessionBooking from "./pages/SessionBooking";
import TeacherSessions from "./pages/teacher/TeacherSessions";
import StudentSessions from "./pages/StudentSessions";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <div className="app-root">
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRouteGuard>
                <HomeScreen />
              </ProtectedRouteGuard>
            }
          />
          
          <Route
            path="/find-teacher"
            element={
              <ProtectedRouteGuard>
                <FindTeacher />
              </ProtectedRouteGuard>
            }
          />

          <Route
            path="/my-sessions"
            element={
              <ProtectedRouteGuard>
                <StudentSessions />
              </ProtectedRouteGuard>
            }
          />

          <Route
            path="/teacher/sessions-schedule"
            element={
              <ProtectedRouteGuard>
                <TeacherSessions />
              </ProtectedRouteGuard>
            }
          />

          <Route
            path="/teacher/schedule-session/:teacherId"
            element={
              <ProtectedRouteGuard>
                <SessionBooking />
              </ProtectedRouteGuard>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRouteGuard>
                <UserProfile />
              </ProtectedRouteGuard>
            }
          />

          <Route
            path="/join"
            element={
              <UnauthenticatedRouteGuard>
                <RegisterScreen />
              </UnauthenticatedRouteGuard>
            }
          />

          <Route
            path="/access"
            element={
              <UnauthenticatedRouteGuard>
                <LoginScreen />
              </UnauthenticatedRouteGuard>
            }
          />
          
          <Route path="/register" element={<Navigate to="/join" replace />} />
          <Route path="/login" element={<Navigate to="/access" replace />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;