import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Adminhome,
  Vote,
  VoteSuccessful,
  Voted,
  NoAccess,
  Closed,
  ManageAdmins,
  ManageUsers,
  Login,
  ManageGroups,
  Group,
  CreateForm,
  Profile,
  Responses,
  Permissions,
  Settings,
} from "./pages";
import AuthCallback from "./utils/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoutes";
import AdminProtectedRoute from "./components/AdminProtectedRoutes";
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <BrowserRouter>
        <Header />
        <hr />
        <Routes>
          <Route
            exact
            path="/"
            element={<ProtectedRoute element={<Home />} />}
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={<AdminProtectedRoute element={<Adminhome />} />}
          />
          <Route
            path="/vote/:id"
            element={<ProtectedRoute element={<Vote />} />}
          />
          <Route
            path="/votesuccess"
            element={<ProtectedRoute element={<VoteSuccessful />} />}
          />
          <Route
            path="/voted"
            element={<ProtectedRoute element={<Voted />} />}
          />
          <Route
            path="/noaccess"
            element={<ProtectedRoute element={<NoAccess />} />}
          />
          <Route
            path="/closed"
            element={<ProtectedRoute element={<Closed />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path="/admin/manageadmins"
            element={<AdminProtectedRoute element={<ManageAdmins />} />}
          />
          <Route
            path="/admin/manageusers"
            element={<AdminProtectedRoute element={<ManageUsers />} />}
          />
          <Route
            path="/admin/managegroups"
            element={<AdminProtectedRoute element={<ManageGroups />} />}
          />
          <Route
            path="/admin/managegroup/:id"
            element={<AdminProtectedRoute element={<Group />} />}
          />
          <Route
            path="/admin/edit/:id"
            element={<AdminProtectedRoute element={<CreateForm />} />}
          />
          <Route
            path="/admin/edit/responses/:id"
            element={<AdminProtectedRoute element={<Responses />} />}
          />
          <Route
            path="/admin/edit/permissions/:id"
            element={<AdminProtectedRoute element={<Permissions />} />}
          />
          <Route
            path="/admin/edit/settings/:id"
            element={<AdminProtectedRoute element={<Settings />} />}
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
