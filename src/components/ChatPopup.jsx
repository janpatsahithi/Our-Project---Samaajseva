// src/components/ChatPopup.jsx
import React, { useState, useEffect, useRef } from 'react';

// --- CONFIGURATION ---
const CHAT_LOGO_ICON = '🎧'; 
const USER_AVATAR = 'U'; 
const SUPPORT_AVATAR = 'S'; 
const LAST_SEEN_TIME = "10 minutes ago"; 
const BOT_RESPONSES = {
    'Status?': "To check the status of your request, please log in and navigate to your Dashboard.",
    'Donate?': "You can support an NGO by clicking 'Apply' on the Donor Dashboard.",
    'Receipt?': "Receipts are automatically emailed upon successful fulfillment.",
    'Agent': "Connecting you with a human agent now. Please wait...",
};
// --- STORAGE KEY ---
const CHAT_VISIBILITY_KEY = 'samaajseva_chat_open';
// --------------------

// Function to initialize visibility from session storage
const getInitialVisibility = () => {
    const savedState = sessionStorage.getItem(CHAT_VISIBILITY_KEY);
    // Defaulting to true, unless explicitly set to 'false' (closed by user)
    return savedState !== 'false'; 
};

const ChatPopup = () => {
    const [isOpen, setIsOpen] = useState(getInitialVisibility); 
    const [inputText, setInputText] = useState('');
    
    const [messages, setMessages] = useState([
        { type: 'incoming', text: "Hello! Welcome to Samaajseva support. How can I help you today?", time: '9:00 PM' },
        { type: 'incoming', text: "Try typing 'status' or click a quick button.", time: '9:00 PM' },
    ]);

    const chatBodyRef = useRef(null);

    // Effect to SAVE state to session storage and handle auto-scroll
    useEffect(() => {
        sessionStorage.setItem(CHAT_VISIBILITY_KEY, isOpen);
        if (chatBodyRef.current && isOpen) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [isOpen, messages]);

    const getTime = () => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const sendMessage = (text, isQuickReply = false) => {
        if (!text && inputText.trim() === '') return;
        // ... (rest of sendMessage logic) ...
        const messageText = text || inputText.trim();
        const currentTime = getTime();

        const userMessage = { type: 'outgoing', text: messageText, time: currentTime };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        
        if (!isQuickReply) {
            setInputText('');
        }

        const key = isQuickReply ? text : messageText;
        const botResponseText = BOT_RESPONSES[key] || "Thank you for your message. An agent will respond shortly.";
        
        setTimeout(() => {
            const botMessage = { type: 'incoming', text: botResponseText, time: getTime() };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        }, 500);
    };

    // Handler for the header's 'X' button
    const handleClose = () => {
        setIsOpen(false);
    };

    // --- CRITICAL FIX ---
    if (!isOpen) {
        // If chat is closed, render the opening FAB button.
        return (
             <div className="chat-fab-open" onClick={() => setIsOpen(true)}>
                💬
            </div>
        );
    }
    // --------------------
    
    // Render the full chat window when isOpen is true
    return (
        <div className="chat-window-container">
            {/* 1. MESSAGE HEADER */}
            <div className="chat-header">
                <div className="chat-header-left">
                    <span className="chat-avatar large">{SUPPORT_AVATAR}</span>
                    <div className="chat-header-info">
                        <span className="chat-title">Support Team</span> &nbsp;| &nbsp;
                        <span className="chat-status">Last seen {LAST_SEEN_TIME}</span> 
                    </div>
                </div>
                <div className="chat-header-right">
                    <span className="header-icon notification-icon">&#128276;</span> 
                    
                    <span className="header-icon" onClick={handleClose}>&times;</span>
                </div>
            </div>
            
            {/* 2. CHAT BOX - MESSAGE PAGE */}
            <div className="chat-body" ref={chatBodyRef}>
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`message-row ${msg.type}`}
                    >
                        {msg.type === 'incoming' && <span className="message-avatar incoming">{SUPPORT_AVATAR}</span>}
                        
                        <div className="message-content">
                            <div className="message-bubble">
                                <p>{msg.text}</p>
                            </div>
                            <span className="message-time">{msg.time}</span>
                        </div>

                        {msg.type === 'outgoing' && <span className="message-avatar outgoing">{USER_AVATAR}</span>}
                    </div>
                ))}
            </div>
            
            {/* 3. CHAT BOX - MESSAGE BOTTOM */}
            <div className="chat-input-area">
                <div className="quick-reply-buttons">
                    {['Status?', 'Donate?', 'Receipt?', 'Agent'].map(text => (
                        <button 
                            key={text} 
                            className="quick-reply-btn"
                            onClick={() => sendMessage(text, true)} 
                        >
                            {text}
                        </button>
                    ))}
                </div>
                
                <div className="chat-input-row">
                    <input 
                        type="text" 
                        placeholder="Type a message..." 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="chat-text-input"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') sendMessage();
                        }}
                    />
                    <button 
                        className="chat-send-btn"
                        onClick={() => sendMessage()}
                    >
                        &#9658; 
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPopup;