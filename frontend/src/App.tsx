import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/health")
      .then((response) => {
        setStatus(response.data.status);
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
  }, []);

  return (
    <>
      <h1>AI Code Review</h1>
      <p>API Status: {status}</p>
    </>
  );
}

export default App;