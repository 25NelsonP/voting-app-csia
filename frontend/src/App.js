import Header from "./components/header";
import Footer from "./components/footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Adminhome, ViewForm } from "./pages";
function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <BrowserRouter>
          <Header />
          <hr />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/admin" element={<Adminhome />} />
            <Route path="/viewForm" element={<ViewForm />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
