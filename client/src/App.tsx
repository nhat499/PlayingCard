import { BrowserRouter, Routes, Route } from "react-router-dom";
import SigninScreen from "./screens/SigninScreen";
import Layout from "./components/ScreenLayout";
import CreateGameScreen from "./screens/CreateGameScreen";
import GameScreen from "./screens/GameScreen";
import TestScreen from "./screens/TestScreen";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<SigninScreen />} />
                    <Route
                        path="/room/:roomId"
                        element={<CreateGameScreen />}
                    />
                    <Route path="/game/:roomId" element={<GameScreen />} />
                    <Route path="/test" element={<TestScreen />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
