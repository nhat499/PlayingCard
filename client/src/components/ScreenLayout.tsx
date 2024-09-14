import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <div style={{
            // width: "95vw",
            // height: "100%",
            // minHeight: "100vh",
            // maxWidth: "97%",
            // maxHeight: "97%",
            // overflowX: "hidden",
            // overflowY: "hidden",
            // margin: 0,
            // padding: 0,
            border: "1px solid black"
        }}>
            <nav style={{
                margin: 0,
                padding: 0,
                // position: "absolute",
                top: "0px",
                height: "20px",
                backgroundColor: "lightblue",
                borderBottom: "1px solid gray",
                width: "100%",
                // padding: "10px"
            }}>

                <Link to="/">Home</Link>
                <button>setting</button>

            </nav>
            <div
                style={{
                    border: "1px solid red",
                    height: "100%",
                    padding: "10px"
                }}>

                <Outlet />
            </div>
        </div>
    )
};

export default Layout;