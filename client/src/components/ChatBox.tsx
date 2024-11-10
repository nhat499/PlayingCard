import { useState, useEffect, useRef } from "react";
import { socket } from "../socket/Socket";
import { useUser } from "../atom/userAtom";
import { Message } from "../../../server/src/interfaces/gameStateInterface";

const ChatBox = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const { user } = useUser();
    const [input, setInput] = useState<string>("");
    const messageEndRef = useRef<HTMLDivElement | null>(null);
    if (!user) {
        throw Error("User not found");
    }
    const sendMessage = () => {
        if (input.trim()) {
            const newMessage: Message = {
                id: Date.now(),
                text: `${user.name}: ${input}`,
                user: user.name,
            };

            socket.emit("SendMessage", { message: input, player: user });
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInput("");
        }
    };

    useEffect(() => {
        socket.on("Message", ({ message, player }) => {
            const newMessage: Message = {
                id: Date.now(),
                text: `${player.name}: ${message}`,
                user: player.name,
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        return () => {
            socket.off("Message");
        };
    });

    // Scroll to the latest message
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div
            style={{
                margin: "20px",
                maxHeight: "450px",
                minHeight: "350px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Chat Messages */}
            <div
                style={{
                    flex: 1,
                    padding: "10px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            alignSelf:
                                message.user === user.name
                                    ? "flex-end"
                                    : "flex-start",
                            backgroundColor:
                                message.user === user.name ? "#007bff" : "#ddd",
                            color:
                                message.user === user.name ? "white" : "black",
                            borderRadius: "20px",
                            padding: "8px 15px",
                            margin: "5px 0",
                            maxWidth: "80%",
                            wordWrap: "break-word",
                        }}
                    >
                        {message.text}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {/* Input Box */}
            <div
                style={{
                    display: "flex",
                    borderTop: "1px solid #ddd",
                    padding: "10px",
                    backgroundColor: "#fff",
                }}
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    style={{
                        flex: 1,
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "20px",
                        fontSize: "16px",
                        marginRight: "10px",
                    }}
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        fontSize: "20px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    &#8594;
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
