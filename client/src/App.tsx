import { BrowserRouter, Routes, Route } from "react-router-dom";
import SigninScreen from "./screens/SigninScreen";
import Layout from "./components/ScreenLayout";
import CreateGameScreen from "./screens/CreateGameScreen";
import GameScreen from "./screens/GameScreen";

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
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
