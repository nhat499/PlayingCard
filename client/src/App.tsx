
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SigninScreen from "./screens/SigninScreen";
import Layout from "./components/ScreenLayout";
import CreateGameScreen from "./screens/CreateGameScreen";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<SigninScreen />} />
                    <Route path="/room/:id" element={<CreateGameScreen />} />
                    {/* <Route path="contact" element={<Contact />} />
                    <Route path="*" element={<NoPage />} /> */}
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;