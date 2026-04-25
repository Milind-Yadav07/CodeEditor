<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import Preview from './Preview';
import AIAssistant from './AIAssistant';
import { useEditor } from '../context/EditorContext';
import { FaCode, FaEye, FaRobot } from 'react-icons/fa';

const Layout = () => {
    const { html, setHtml, css, setCss, js, setJs, layout, theme } = useEditor();
    const [activeTab, setActiveTab] = useState('html');
    const [mobilePanel, setMobilePanel] = useState('editor'); // 'editor' | 'preview' | 'ai'
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile breakpoint
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto-switch to tabbed mode on mobile for split layout
    const effectiveLayout = (isMobile && layout === 'split') ? 'tabs' : layout;

    const renderEditors = () => (
        <>
            <div className="editor-pane">
                <CodeEditor language="html" value={html} onChange={setHtml} theme={theme} />
            </div>
            <div className="editor-pane">
                <CodeEditor language="css" value={css} onChange={setCss} theme={theme} />
            </div>
            <div className="editor-pane" style={{ borderRight: 'none' }}>
                <CodeEditor language="javascript" value={js} onChange={setJs} theme={theme} />
            </div>
        </>
    );

    const renderTabbedEditors = () => (
        <div className="tabbed-editor-container">
            <div className="tab-bar">
                {['html', 'css', 'javascript'].map((lang) => (
                    <button
                        key={lang}
                        onClick={() => setActiveTab(lang)}
                        className={`tab-btn ${activeTab === lang ? 'active' : ''}`}
                    >
                        {lang}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {activeTab === 'html' && <CodeEditor language="html" value={html} onChange={setHtml} theme={theme} />}
                {activeTab === 'css' && <CodeEditor language="css" value={css} onChange={setCss} theme={theme} />}
                {activeTab === 'javascript' && <CodeEditor language="javascript" value={js} onChange={setJs} theme={theme} />}
            </div>
        </div>
    );

    const renderMobilePanelSwitcher = () => {
        const panels = layout === 'ai'
            ? [
                { key: 'editor', label: 'Code', icon: <FaCode /> },
                { key: 'preview', label: 'Preview', icon: <FaEye /> },
                { key: 'ai', label: 'AI', icon: <FaRobot /> }
            ]
            : [
                { key: 'editor', label: 'Code', icon: <FaCode /> },
                { key: 'preview', label: 'Preview', icon: <FaEye /> }
            ];

        return (
            <div className="mobile-panel-switcher">
                {panels.map(({ key, label, icon }) => (
                    <button
                        key={key}
                        onClick={() => setMobilePanel(key)}
                        className={`mobile-panel-btn ${mobilePanel === key ? 'active' : ''}`}
                    >
                        {icon} {label}
                    </button>
                ))}
            </div>
        );
    };

    // ===== MOBILE LAYOUT =====
    if (isMobile) {
        return (
            <div className={`main-layout ${effectiveLayout}`} style={{ flexDirection: 'column' }}>
                {renderMobilePanelSwitcher()}
                <div className="mobile-panel-content">
                    {mobilePanel === 'editor' && renderTabbedEditors()}
                    {mobilePanel === 'preview' && <Preview html={html} css={css} js={js} />}
                    {mobilePanel === 'ai' && layout === 'ai' && <AIAssistant />}
                    {/* If not in AI layout but user somehow is on AI panel, show editor */}
                    {mobilePanel === 'ai' && layout !== 'ai' && renderTabbedEditors()}
                </div>
            </div>
        );
    }

    // ===== DESKTOP LAYOUT =====
    return (
        <div className={`main-layout ${effectiveLayout}`}>
            {effectiveLayout === 'ai' ? (
                <>
                    <div className="ai-code-preview-container">
                        <div className="ai-code-area">
                            {renderTabbedEditors()}
                        </div>
                        <div className="ai-preview-area">
                            <Preview html={html} css={css} js={js} />
                        </div>
                    </div>
                    <div className="ai-assistant-panel">
                        <AIAssistant />
                    </div>
                </>
            ) : (
                <>
                    {/* Editor Section */}
                    <div className={`editor-section ${effectiveLayout === 'split' ? 'split-mode' : 'tabs-mode'}`}>
                        {effectiveLayout === 'split' ? renderEditors() : renderTabbedEditors()}
                    </div>

                    {/* Preview Section */}
                    <div className="preview-section">
                        <Preview html={html} css={css} js={js} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Layout;
=======
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
>>>>>>> 2c3b80bd53bdf6fb99ec7a7ec4ea50b7d125d6a3
