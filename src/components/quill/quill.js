import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = ({ id }) => {
    const editorRef = useRef(null);
    const socket = useRef(null);
    const quillRef = useRef(null);
    const [quill, setQuill] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        socket.current = io("http://localhost:3001");
        socket.current.emit("join-document", id);

        const editor = new Quill(editorRef.current, {
            theme: "snow",
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline"],
                    ["code-block"],
                ],
            },
        });

        setQuill(editor);
        quillRef.current = editor;

        // ✅ Load document content
        socket.current.on("load-document", (content) => {
            editor.setContents(content);
        });

        // ✅ Handle incoming changes without conflicts
        socket.current.on("receive-changes", (delta) => {
            if (isTyping) return; // Prevent conflicts during user typing

            editor.enable(false); // Temporarily disable the editor
            editor.updateContents(delta);
            editor.enable(true); // Re-enable after update
        });

        // ✅ Send changes when user types
        editor.on("text-change", (delta) => {
            setIsTyping(true);
            socket.current.emit("send-changes", { documentId: id, delta });

            // Reset typing status after 1 second
            setTimeout(() => setIsTyping(false), 1000);
        });

        return () => {
            socket.current.disconnect();
        };
    }, [id]);

    return <div ref={editorRef} style={{ height: "400px", backgroundColor: "white" }} />;
};

export default QuillEditor; 
