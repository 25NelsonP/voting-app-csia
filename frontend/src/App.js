import Header from "./components/header";
import Footer from "./components/footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Adminhome,
  ViewForm,
  VoteSuccessful,
  ManageAdmins,
  ManageUsers,
} from "./pages";
function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <BrowserRouter>
          <Header />
          <hr />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/admin" element={<Adminhome />} />
            <Route path="/viewForm" element={<ViewForm />} />
            <Route path="/voteSuccess" element={<VoteSuccessful />} />
            <Route path="/admin/manageAdmins" element={<ManageAdmins />} />
            <Route path="/admin/manageUsers" element={<ManageUsers />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
