import { useState, useEffect, useRef } from "react";
import { socket } from "../socket/Socket";

type Message = {
    id: number;
    text: string;
    sender: "user" | "other"; // Simple sender type for differentiation
};

const ChatBox = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    // Simulate bot response after user sends a message
    const sendMessage = () => {
        if (input.trim()) {
            const newMessage: Message = {
                id: Date.now(),
                text: input,
                sender: "user",
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInput(""); // Clear the input field

            // // Simulate a bot response after a delay
            // setTimeout(() => {
            //     const botMessage: Message = {
            //         id: Date.now() + 1,
            //         text: "Hello! This is a bot response.",
            //         sender: "bot",
            //     };
            //     setMessages((prevMessages) => [...prevMessages, botMessage]);
            // }, 1000);
        }
    };

    useEffect(() => {
        socket.on("DropOnBoard", ({ item, roomId, boardItem }) => {
            const newMessage: Message = {
                id: Date.now(),
                text: item.name + " DropOnBoard",
                sender: "other",
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        socket.on("DropFromBoard", ({ item, roomId, boardItem }) => {
            const newMessage: Message = {
                id: Date.now(),
                text: item.name + " DropFromBoard",
                sender: "other",
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });


        socket.on("AddToStack", ({ item, roomId, stackId }) => {
            const newMessage: Message = {
                id: Date.now(),
                text: item.name + " AddToStack",
                sender: "other",
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
    }, []);

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
                            alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
                            backgroundColor: message.sender === "user" ? "#007bff" : "#ddd",
                            color: message.sender === "user" ? "white" : "black",
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
