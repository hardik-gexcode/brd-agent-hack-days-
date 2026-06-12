import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster position="bottom-right" toastOptions={{
      style:{background:"#0A0A0A",color:"#F7F6F2",fontFamily:"Inter,sans-serif",
             fontSize:"13px",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.08)"}
    }}/>
  </StrictMode>
);
