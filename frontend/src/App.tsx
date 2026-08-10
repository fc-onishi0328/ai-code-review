import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ReviewPage from "./pages/ReviewPage";
import HistoryPage from "./pages/HistoryPage";
import GuestOnlyRoute from "./components/GuestOnlyRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HistoryDetailPage from "./pages/HistoryDetailPage";

function App() {
  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<ReviewPage />} />
          <Route path="/login" element={<GuestOnlyRoute><LoginPage /></GuestOnlyRoute>} />
          <Route path="/register" element={<GuestOnlyRoute><RegisterPage /></GuestOnlyRoute>} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<HistoryDetailPage />}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;