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
