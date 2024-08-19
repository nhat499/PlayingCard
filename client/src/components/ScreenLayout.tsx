import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
            }}>
            <nav style={{
                position: "absolute",
                borderBottom: "1px solid gray",
                width: "100%",
                padding: "10px"
            }}>

                <Link to="/">Home</Link>
                <button>setting</button>

            </nav>

            <Outlet />
        </div>
    )
};

export default Layout;