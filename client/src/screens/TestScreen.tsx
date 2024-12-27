import { useEffect, useState } from "react";

const TestScreen = () => {
    const [user, setUser] = useState<{ user: number; name: string } | null>();

    useEffect(() => {
        fetch("http://localhost:3000/test")
            .then((res) => res.json())
            .then((data) => {
                console.log("data:", data);
                setUser(data);
            })
            .catch((error) => {
                console.error("CORS Error:", error);
            });
    }, []);

    return (
        <div>
            <h1>Test Screen</h1>
            {user && <h2>{user.user}</h2>}
            {user && <h2>{user.name}</h2>}
        </div>
    );
};

export default TestScreen;
