import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import SocketTest from "./socket/SocketTest";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
