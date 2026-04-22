import React, { useEffect, useRef, useState } from 'react';
import { FaExpand, FaCompress } from 'react-icons/fa';

const Preview = ({ html, css, js }) => {
    const iframeRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const document = iframeRef.current.contentDocument;
        const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `;
        document.open();
        document.write(content);
        document.close();
    }, [html, css, js]);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div style={{
            height: isFullscreen ? '100vh' : '100%',
            width: isFullscreen ? '100vw' : '100%',
            position: isFullscreen ? 'fixed' : 'relative',
            top: isFullscreen ? 0 : 'auto',
            left: isFullscreen ? 0 : 'auto',
            zIndex: isFullscreen ? 1000 : 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--preview-bg)',
            transition: 'all 0.3s ease'
        }}>
            <div className="preview-header" style={{
                padding: '0.45rem 0.75rem',
                backgroundColor: 'var(--bg-color)',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                color: 'var(--secondary-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
            }}>
                <span>Preview</span>
                <button
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--secondary-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--editor-bg)';
                        e.currentTarget.style.color = 'var(--primary-color)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--secondary-color)';
                    }}
                >
                    {isFullscreen ? <FaCompress size={14} /> : <FaExpand size={14} />}
                </button>
            </div>
            <iframe
                ref={iframeRef}
                title="preview"
                style={{
                    flex: 1,
                    border: 'none',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff' // Always white background for preview unless specified in CSS
                }}
            />
        </div>
    );
};

export default Preview;
