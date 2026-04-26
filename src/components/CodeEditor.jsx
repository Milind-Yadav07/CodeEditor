import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { FaHtml5, FaCss3Alt, FaJs, FaCopy, FaCheck } from 'react-icons/fa';

const CodeEditor = ({ language, value, onChange, theme }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const getExtensions = () => {
        switch (language) {
            case 'html': return [html()];
            case 'css': return [css()];
            case 'javascript': return [javascript({ jsx: true })];
            default: return [];
        }
    };

    const getTheme = () => {
        // You can add more themes or make this dynamic based on user preference
        // For now, if app theme is dark, use oneDark, else default (light)
        return theme === 'dark' ? oneDark : 'light';
    };

    const getIcon = () => {
        switch (language) {
            case 'html': return <FaHtml5 style={{ color: '#e34c26', marginRight: '0.4rem', fontSize: '1rem' }} />;
            case 'css': return <FaCss3Alt style={{ color: '#264de4', marginRight: '0.4rem', fontSize: '1rem' }} />;
            case 'javascript': return <FaJs style={{ color: '#f0db4f', marginRight: '0.4rem', fontSize: '1rem' }} />;
            default: return null;
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="code-editor-header" style={{
                padding: '0.45rem 0.75rem',
                backgroundColor: 'var(--bg-color)',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                color: 'var(--secondary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {getIcon()}
                    <span className="editor-lang-label">{language}</span>
                </div>
                <button
                    onClick={handleCopy}
                    title={`Copy ${language} code`}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: copied ? '#10b981' : 'var(--secondary-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.8rem',
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        if (!copied) e.currentTarget.style.color = 'var(--primary-color)';
                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                    }}
                    onMouseOut={(e) => {
                        if (!copied) e.currentTarget.style.color = 'var(--secondary-color)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    {copied ? <FaCheck /> : <FaCopy />}
                    <span className="copy-label" style={{ fontSize: '0.72rem', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
                <CodeMirror
                    value={value}
                    height="100%"
                    extensions={getExtensions()}
                    theme={getTheme()}
                    onChange={onChange}
                    style={{ fontSize: '13px' }}
                    basicSetup={{
                        lineNumbers: true,
                        foldGutter: true,
                        highlightActiveLineGutter: true,
                        highlightActiveLine: true,
                        tabSize: 2,
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;