import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import GameScreen from "./components/GameScreen";
import SocketTest from "./test/SocketTest";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {/* <GameScreen /> */}
        <SocketTest />
    </StrictMode>
);
