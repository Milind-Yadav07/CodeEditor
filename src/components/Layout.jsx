import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import Preview from './Preview';
import { useEditor } from '../context/EditorContext';

const Layout = () => {
    const { html, setHtml, css, setCss, js, setJs, layout, theme } = useEditor();
    const [activeTab, setActiveTab] = useState('html');

    const renderEditors = () => (
        <>
            <div style={{ flex: 1, borderRight: '1px solid var(--border-color)', minWidth: 0, height: '100%', overflow: 'hidden' }}>
                <CodeEditor language="html" value={html} onChange={setHtml} theme={theme} />
            </div>
            <div style={{ flex: 1, borderRight: '1px solid var(--border-color)', minWidth: 0, height: '100%', overflow: 'hidden' }}>
                <CodeEditor language="css" value={css} onChange={setCss} theme={theme} />
            </div>
            <div style={{ flex: 1, minWidth: 0, height: '100%', overflow: 'hidden' }}>
                <CodeEditor language="javascript" value={js} onChange={setJs} theme={theme} />
            </div>
        </>
    );

    const renderTabbedEditors = () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
                {['html', 'css', 'javascript'].map((lang) => (
                    <button
                        key={lang}
                        onClick={() => setActiveTab(lang)}
                        style={{
                            padding: '0.8rem 1.5rem',
                            background: activeTab === lang ? 'var(--editor-bg)' : 'transparent',
                            border: 'none',
                            borderBottom: activeTab === lang ? '2px solid var(--primary-color)' : 'none',
                            color: activeTab === lang ? 'var(--primary-color)' : 'var(--secondary-color)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            fontSize: '0.85rem'
                        }}
                    >
                        {lang}
                    </button>
                ))}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                {activeTab === 'html' && <CodeEditor language="html" value={html} onChange={setHtml} theme={theme} />}
                {activeTab === 'css' && <CodeEditor language="css" value={css} onChange={setCss} theme={theme} />}
                {activeTab === 'javascript' && <CodeEditor language="javascript" value={js} onChange={setJs} theme={theme} />}
            </div>
        </div>
    );

    return (
        <div style={{
            display: 'flex',
            flexDirection: layout === 'split' ? 'column' : 'row', // On mobile, always column, but handled via media queries ideally. For now, logic based.
            // Actually, let's make the main layout split vertically (editors top/left, preview bottom/right)
            height: 'calc(100vh - 60px)',
            overflow: 'hidden'
        }}>
            {/* Editor Section */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: layout === 'split' ? 'row' : 'column',
                borderRight: '1px solid var(--border-color)',
                borderBottom: layout === 'split' ? '1px solid var(--border-color)' : 'none',
                overflow: 'hidden'
            }}>
                {layout === 'split' ? renderEditors() : renderTabbedEditors()}
            </div>

            {/* Preview Section */}
            <div style={{ flex: 1 }}>
                <Preview html={html} css={css} js={js} />
            </div>
        </div>
    );
};

export default Layout;
