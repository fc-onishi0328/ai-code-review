import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ReviewPage from "./pages/ReviewPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path="/" element={<ReviewPage />} />
            <Route path="/history" element={<HistoryPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;