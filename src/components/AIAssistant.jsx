import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaEraser, FaSpinner } from 'react-icons/fa';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { useEditor } from '../context/EditorContext';

const AIAssistant = () => {
    const { html, setHtml, css, setCss, js, setJs } = useEditor();
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm Myra, your AI Assistant", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Initialize Gemini with LangChain
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const modelName = import.meta.env.VITE_GEMINI_MODEL || "gemini-3-flash-preview";
    
    // Validate API Key
    const isApiKeyValid = apiKey && apiKey !== "YOUR_API_KEY_HERE";

    const getChatModel = () => {
        if (!isApiKeyValid) return null;
        try {
            return new ChatGoogleGenerativeAI({
                apiKey: apiKey,
                model: modelName || "gemini-1.5-flash",
                modelName: modelName || "gemini-1.5-flash",
                maxOutputTokens: 4096, // Increased tokens for full website generation
                temperature: 0.7,
            });
        } catch (err) {
            console.error("Failed to initialize ChatGoogleGenerativeAI:", err);
            return null;
        }
    };

    const systemInstruction = `You are a world-class senior developer helping the user in a live code playground.

    OUTPUT RULES:
    1. FOR WEBSITE/UI REQUESTS (e.g., "build a landing page", "make a button"):
       - You MUST provide ALL THREE BLOCKS: \`\`\`html, \`\`\`css, AND \`\`\`js.
       - Use modern, premium design aesthetics.
    2. FOR LOGIC/DSA QUESTIONS (e.g., "star patterns", "palindrome", "sorting"):
       - Provide ONLY the JavaScript block (\`\`\`js\`). 
       - DO NOT provide HTML or CSS blocks.
       - Use document.write() or document.body.innerHTML to show results in the preview.
       - Use <pre> tags for patterns to preserve spacing.
    
    GENERAL GUIDELINES:
    - Always provide the full code within the block(s).
    - Briefly explain your logic at the start.
    - Wrap code in triple backticks with the correct language name.
    
    Make the designs look premium and the logic highly efficient.`;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const updatePlaygroundCode = (text) => {
        const extractBlock = (regex) => {
            const match = text.match(regex);
            if (match && match[1]) {
                return match[1].trim();
            }
            return null;
        };

        const newHtml = extractBlock(/```html\s*([\s\S]*?)(?:```|$)/i);
        const newCss = extractBlock(/```(?:css|style)\s*([\s\S]*?)(?:```|$)/i);
        const newJs = extractBlock(/```(?:js|javascript|jsx)\s*([\s\S]*?)(?:```|$)/i);

        if (newHtml !== null) setHtml(newHtml);
        if (newCss !== null) setCss(newCss);
        if (newJs !== null) setJs(newJs);
        
        // Debugging log for the user (visible in console)
        console.log("Blocks detected:", {
            html: !!newHtml,
            css: !!newCss,
            js: !!newJs
        });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        if (!isApiKeyValid) {
            setMessages(prev => [...prev, { 
                id: Date.now(), 
                text: "API Key is missing or invalid. Please check your .env file.", 
                sender: 'ai' 
            }]);
            return;
        }

        const userMsgText = input;
        const userMsg = { id: Date.now(), text: userMsgText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const chatModel = getChatModel();
            if (!chatModel) throw new Error("Could not initialize model");

            // Prepare LangChain messages including history
            const langchainMessages = [
                new SystemMessage(systemInstruction),
            ];

            // Add previous messages (limit to last 5 for context efficiency)
            messages.slice(-5).forEach(m => {
                if (m.sender === 'user') {
                    langchainMessages.push(new HumanMessage(m.text));
                } else if (m.sender === 'ai') {
                    langchainMessages.push(new AIMessage(m.text));
                }
            });

            // Add current context and request
            const contextualPrompt = `CURRENT CODE IN EDITOR:
--- HTML ---
${html}

--- CSS ---
${css}

--- JS ---
${js}

USER REQUEST: ${userMsgText}

INSTRUCTION: Update the code. You MUST provide the updated HTML, CSS, and JS blocks. Even if some are unchanged, repeat them so the editor stays updated.`;

            langchainMessages.push(new HumanMessage(contextualPrompt));

            // Create a placeholder message for streaming
            const aiMsgId = Date.now() + 1;
            setMessages(prev => [...prev, { id: aiMsgId, text: '', sender: 'ai' }]);
            
            const stream = await chatModel.stream(langchainMessages);
            let fullText = '';

            for await (const chunk of stream) {
                const content = chunk.content;
                fullText += content;
                
                setMessages(prev => prev.map(msg => 
                    msg.id === aiMsgId ? { ...msg, text: fullText } : msg
                ));
            }

            // Check if any blocks were found at all
            let finalOutput = fullText;
            if (!finalOutput.includes('```')) {
                finalOutput += "\n\n*(Note: No code blocks were detected. If you asked for code, try being more specific about the language.)*";
                
                setMessages(prev => prev.map(msg => 
                    msg.id === aiMsgId ? { ...msg, text: finalOutput } : msg
                ));
            }

            updatePlaygroundCode(finalOutput);
        } catch (error) {
            console.error("LangChain Error:", error);
            let errorMessage = "Sorry, I encountered an error with the AI service.";
            
            if (error.message.includes("API key")) {
                errorMessage = "Invalid API Key. Please check your .env file.";
            } else if (error.message.includes("model")) {
                errorMessage = `Model error. Verify if the model is available.`;
            }

            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                text: errorMessage, 
                sender: 'ai' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([{ id: 1, text: "Chat cleared! How can I help you now?", sender: 'ai' }]);
    };

    return (
        <div className="ai-assistant-wrapper" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: 'var(--editor-bg)',
            color: 'var(--text-color)',
            fontFamily: 'inherit'
        }}>
            {/* Header */}
            <div className="ai-assistant-header" style={{
                padding: '0.75rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--bg-color)',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <FaRobot style={{ color: 'var(--primary-color)', fontSize: '1.1rem' }} />
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>AI Assistant</h3>
                </div>
                <button 
                    onClick={clearChat}
                    title="Clear Chat"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--secondary-color)',
                        cursor: 'pointer',
                        padding: '0.35rem',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <FaEraser />
                </button>
            </div>

            {/* Messages */}
            <div className="ai-messages" style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minHeight: 0
            }}>
                {messages.map((msg) => (
                    <div 
                        key={msg.id}
                        style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '92%',
                            display: 'flex',
                            gap: '0.6rem',
                            flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                        }}
                    >
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: msg.sender === 'user' ? '#3b82f6' : 'var(--primary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.7rem',
                            flexShrink: 0
                        }}>
                            {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
                        </div>
                        <div style={{
                            backgroundColor: msg.sender === 'user' ? '#3b82f6' : 'var(--bg-color)',
                            color: msg.sender === 'user' ? 'white' : 'var(--text-color)',
                            padding: '0.75rem 0.9rem',
                            borderRadius: '12px',
                            borderTopRightRadius: msg.sender === 'user' ? '2px' : '12px',
                            borderTopLeftRadius: msg.sender === 'ai' ? '2px' : '12px',
                            fontSize: '0.85rem',
                            lineHeight: '1.5',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none',
                            whiteSpace: 'pre-wrap',
                            overflow: 'hidden',
                            wordBreak: 'break-word'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.6rem', alignItems: 'center', padding: '0.4rem 0.75rem' }}>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--secondary-color)' }}>AI is thinking...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form 
                onSubmit={handleSend}
                className="ai-input-form"
                style={{
                    padding: '0.75rem',
                    borderTop: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-color)',
                    display: 'flex',
                    gap: '0.6rem',
                    flexShrink: 0
                }}
            >
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isLoading ? "Generating..." : "Ask AI to code..."}
                    disabled={isLoading}
                    style={{
                        flex: 1,
                        backgroundColor: 'var(--editor-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '20px',
                        padding: '0.65rem 1rem',
                        color: 'var(--text-color)',
                        fontSize: '0.85rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        opacity: isLoading ? 0.7 : 1,
                        minWidth: 0
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
                <button 
                    type="submit"
                    disabled={isLoading}
                    style={{
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'transform 0.2s, filter 0.2s',
                        opacity: isLoading ? 0.7 : 1,
                        flexShrink: 0
                    }}
                    onMouseOver={(e) => {
                        if (!isLoading) {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.filter = 'brightness(1.1)';
                        }
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.filter = 'brightness(1)';
                    }}
                >
                    {isLoading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaPaperPlane />}
                </button>
            </form>
        </div>
    );
};

export default AIAssistant;
