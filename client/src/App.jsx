import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ClassDetails from "./pages/ClassDetails";
import SubjectDetails from "./pages/SubjectDetails";
import TopicPlanner from "./pages/TopicPlanner";
import LessonNote from "./pages/LessonNote";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  // If the app is still reading local browser storage on boot, freeze the view safely
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">
        Loading TeachEngine...
      </div>
    );
  }

  // If no secure token exists globally, redirect them to the login screen immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, let them view the secure page content!
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          } 
        />
        <Route path="/classes/:classId"
          element={
            <ProtectedRoute>
              <ClassDetails/>
            </ProtectedRoute>
          }
        />
        <Route path="/subjects/:subjectId" element={
          <ProtectedRoute>
            <SubjectDetails/>
          </ProtectedRoute>
        }/>

        <Route path="/schemes/:schemeId" element={
          <ProtectedRoute>
            <TopicPlanner/>
          </ProtectedRoute>
        }/>

        <Route path="/topics/:topicId/lesson" element={
          <ProtectedRoute>
            <LessonNote/>
          </ProtectedRoute>
        }/>

        {/* Fallback Catch-All: Send unmapped URLs straight to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App



