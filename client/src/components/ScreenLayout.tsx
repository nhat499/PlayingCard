import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <div
            style={{
                border: "1px solid black",
            }}
        >
            <nav
                style={{
                    margin: 0,
                    padding: 0,
                    top: "0px",
                    height: "20px",
                    backgroundColor: "lightblue",
                    borderBottom: "1px solid gray",
                    width: "100%",
                }}
            >
                <Link to="/">Home</Link>
                <button>setting</button>
            </nav>
            <div
                style={{
                    height: "100%",
                    padding: "10px",
                }}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
