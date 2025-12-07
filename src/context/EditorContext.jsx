import React, { createContext, useContext, useState, useEffect } from 'react';

const EditorContext = createContext();

export const useEditor = () => {
    return useContext(EditorContext);
};

export const EditorProvider = ({ children }) => {
    const [html, setHtml] = useState('<h1>Hello From WebDev Playground✌️</h1>');
    const [css, setCss] = useState('body{ font-family: sans-serif; padding: 2rem; background-color: #000000ff; color: #79afffff;}');
    const [js, setJs] = useState('console.log("Hello from WebDev Playground");');
    const [theme, setTheme] = useState('light');
    const [layout, setLayout] = useState('split'); // 'split' or 'tabs'

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const value = {
        html, setHtml,
        css, setCss,
        js, setJs,
        theme, setTheme,
        layout, setLayout,
        toggleTheme
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
};
