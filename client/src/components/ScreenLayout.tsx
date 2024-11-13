import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)",
                fontFamily: "'Poppins', sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Left Sidebar */}
            <nav
                style={{
                    width: "10%",
                    backgroundColor: "#4a5568",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "30px 20px",
                    color: "#fff",
                    boxShadow: "2px 0 12px rgba(0, 0, 0, 0.1)",
                    borderRadius: "0 15px 15px 0",
                }}
            >
                <div>
                    <h2 style={{ marginBottom: "30px" }}>Menu</h2>
                    <Link
                        to="/"
                        style={{
                            display: "block",
                            textDecoration: "none",
                            color: "#cbd5e0",
                            fontSize: "18px",
                            marginBottom: "20px",
                        }}
                    >
                        Home
                    </Link>
                </div>
                <button
                    style={{
                        backgroundColor: "#2d3748",
                        color: "#cbd5e0",
                        border: "none",
                        borderRadius: "20px",
                        padding: "10px",
                        fontSize: "16px",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1a202c")
                    }
                    onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#2d3748")
                    }
                >
                    Settings
                </button>
            </nav>

            {/* Main Content */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "40px",
                }}
            >
                <div
                    style={{
                        width: "90%",
                        backgroundColor: "#ffffff",
                        borderRadius: "15px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        padding: "30px",
                        textAlign: "center",
                    }}
                >
                    <h2 style={{ color: "#333", marginBottom: "20px" }}>
                        Playing Cards
                    </h2>
                    {/* Add a form or input components here */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
