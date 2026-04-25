<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { FaMoon, FaSun, FaColumns, FaTable, FaDownload, FaMagic, FaBars, FaTimes } from 'react-icons/fa';
import { useEditor } from '../context/EditorContext';

const Navbar = () => {
    const { theme, toggleTheme, layout, setLayout, html, css, js } = useEditor();
    const [isDownloading, setIsDownloading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const downloadFile = (filename, content, type) => {
        const element = document.createElement('a');
        const file = new Blob([content], { type: type });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleDownload = () => {
        setIsDownloading(true);
        // Create full HTML file with links to CSS and JS
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebDev Playground Export</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${html}
    <script src="script.js"></script>
</body>
</html>`;

        downloadFile('index.html', fullHtml, 'text/html');
        // Small delay to ensure browser doesn't block multiple downloads
        setTimeout(() => downloadFile('style.css', css, 'text/css'), 100);
        setTimeout(() => downloadFile('script.js', js, 'text/javascript'), 200);

        setTimeout(() => setIsDownloading(false), 3000);
        setMobileMenuOpen(false);
    };

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);
        setMobileMenuOpen(false);
    };

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };
        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen]);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <nav className="navbar" ref={menuRef}>
                <div className="navbar-brand">
                    <h1>WebDev Playground</h1>
                </div>

                <div className="navbar-actions">
                    {/* Layout toggle - visible on desktop */}
                    <div className="layout-toggle-group">
                        <button
                            onClick={() => setLayout('split')}
                            title="Split View"
                            className={`layout-toggle-btn ${layout === 'split' ? 'active' : ''}`}
                        >
                            <FaColumns />
                        </button>
                        <button
                            onClick={() => setLayout('tabs')}
                            title="Tabbed View"
                            className={`layout-toggle-btn ${layout === 'tabs' ? 'active' : ''}`}
                        >
                            <FaTable />
                        </button>
                    </div>

                    {/* AI Button - visible on desktop */}
                    <div className="ai-button-container">
                        <button
                            className="ai-button"
                            onClick={() => setLayout('ai')}
                        >
                            <FaMagic /> AI Agent
                        </button>
                    </div>

                    {/* Download - visible on desktop */}
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        title="Download Source Code"
                        className={`download-btn ${isDownloading ? 'downloaded' : ''}`}
                    >
                        <FaDownload />
                        <span>{isDownloading ? 'Downloaded!' : 'Download'}</span>
                    </button>

                    {/* Theme toggle - always visible */}
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle-btn"
                        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                        {theme === 'light' ? <FaMoon /> : <FaSun />}
                    </button>

                    {/* Hamburger - visible on mobile */}
                    <button
                        className="hamburger-btn"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        title="Menu"
                    >
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu overlay */}
            <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-row">
                    <label>Layout</label>
                    <div className="layout-toggle-group">
                        <button
                            onClick={() => handleLayoutChange('split')}
                            title="Split View"
                            className={`layout-toggle-btn ${layout === 'split' ? 'active' : ''}`}
                        >
                            <FaColumns />
                        </button>
                        <button
                            onClick={() => handleLayoutChange('tabs')}
                            title="Tabbed View"
                            className={`layout-toggle-btn ${layout === 'tabs' ? 'active' : ''}`}
                        >
                            <FaTable />
                        </button>
                    </div>
                </div>

                <div className="mobile-menu-row">
                    <label>AI</label>
                    <div className="ai-button-container">
                        <button
                            className="ai-button"
                            onClick={() => handleLayoutChange('ai')}
                        >
                            <FaMagic /> AI Agent
                        </button>
                    </div>
                </div>

                <div className="mobile-menu-row">
                    <label>Export</label>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`download-btn ${isDownloading ? 'downloaded' : ''}`}
                    >
                        <FaDownload />
                        <span>{isDownloading ? 'Downloaded!' : 'Download'}</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Navbar;
=======
import React from 'react';
import { FaMoon, FaSun, FaColumns, FaTable } from 'react-icons/fa';
import { useEditor } from '../context/EditorContext';

const Navbar = () => {
    const { theme, toggleTheme, layout, setLayout } = useEditor();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.8rem 1.5rem',
            backgroundColor: 'var(--bg-color)',
            borderBottom: '1px solid var(--border-color)',
            color: 'var(--text-color)',
            transition: 'background-color 0.3s, color 0.3s'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>

                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: '400',
                    fontFamily: '"Pacifico", cursive',
                    letterSpacing: '1px',
                    background: 'linear-gradient(90deg, var(--primary-color), #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    WebDev Playground
                </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    display: 'flex',
                    backgroundColor: 'var(--editor-bg)',
                    padding: '0.2rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)'
                }}>
                    <button
                        onClick={() => setLayout('split')}
                        title="Split View"
                        style={{
                            background: layout === 'split' ? 'var(--bg-color)' : 'transparent',
                            border: 'none',
                            padding: '0.4rem 0.6rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: layout === 'split' ? 'var(--primary-color)' : 'var(--secondary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: layout === 'split' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        <FaColumns />
                    </button>
                    <button
                        onClick={() => setLayout('tabs')}
                        title="Tabbed View"
                        style={{
                            background: layout === 'tabs' ? 'var(--bg-color)' : 'transparent',
                            border: 'none',
                            padding: '0.4rem 0.6rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: layout === 'tabs' ? 'var(--primary-color)' : 'var(--secondary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: layout === 'tabs' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        <FaTable />
                    </button>
                </div>

                <button
                    onClick={toggleTheme}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: 'var(--text-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--editor-bg)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    {theme === 'light' ? <FaMoon /> : <FaSun />}
                </button>


            </div>
        </nav>
    );
};

export default Navbar;
>>>>>>> 2c3b80bd53bdf6fb99ec7a7ec4ea50b7d125d6a3
