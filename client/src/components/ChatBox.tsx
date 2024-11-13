import React, { useState, useEffect, useRef } from 'react';
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
            socket.emit("SendMessage", { message: input, player: user });
            setInput("");
        }
    };

    useEffect(() => {
        socket.on("Message", ({ message, player }) => {
            const newMessage: Message = {
                id: Date.now(),
                text: `${message}`,
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
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    return (
        <div
            style={{
                margin: "20px",
                maxHeight: "450px",
                minHeight: "100px",
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
                    overflowY: "auto",  // Enable scrolling for the chat box
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        style={{
                            alignSelf:
                                message.user === user.name ? "flex-end" : "flex-start",
                            maxWidth: "80%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start"
                        }}>
                        <sub
                            style={{
                                marginTop: "10px",
                                marginLeft: "10px"
                            }}
                        >{message.user != user.name && message.user}</sub>
                        <div
                            style={{
                                backgroundColor:
                                    message.user === user.name ? "#007bff" : "#ddd",
                                color: message.user === user.name ? "white" : "black",
                                padding: "5px 15px",
                                borderRadius: "20px",
                                // margin: "5px 0",
                                textAlign: "left",
                                wordWrap: "break-word",
                            }}
                        >
                            {message.text}
                        </div>

                    </div>
                ))}
                <div ref={messageEndRef} /> {/* This is the element you're scrolling to */}
            </div>

            {/* Input Box */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    borderTop: "1px solid #ddd",
                    // padding: "0 0px 0 0",
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
                        // border: "1px solid #ddd",
                        border: "none",
                        outline: "none",
                        borderRadius: "20px",
                        fontSize: "20px",
                        margin: "0px 10px 0 10px",
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
                        width: "30px",
                        height: "30px",
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
