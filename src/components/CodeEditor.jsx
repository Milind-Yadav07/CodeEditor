import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';

const CodeEditor = ({ language, value, onChange, theme }) => {
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
            case 'html': return <FaHtml5 style={{ color: '#e34c26', marginRight: '0.5rem', fontSize: '1.1rem' }} />;
            case 'css': return <FaCss3Alt style={{ color: '#264de4', marginRight: '0.5rem', fontSize: '1.1rem' }} />;
            case 'javascript': return <FaJs style={{ color: '#f0db4f', marginRight: '0.5rem', fontSize: '1.1rem' }} />;
            default: return null;
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--bg-color)',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.9rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                color: 'var(--secondary-color)',
                display: 'flex',
                alignItems: 'center'
            }}>
                {getIcon()}
                {language}
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
                <CodeMirror
                    value={value}
                    height="100%"
                    extensions={getExtensions()}
                    theme={getTheme()}
                    onChange={onChange}
                    style={{ fontSize: '14px' }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;