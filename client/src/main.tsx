import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom styles for RTL support
const style = document.createElement('style');
style.textContent = `
  body {
    font-family: 'Tajawal', 'Tahoma', sans-serif;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
