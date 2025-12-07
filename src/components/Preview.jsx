import React, { useEffect, useRef } from 'react';

const Preview = ({ html, css, js }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        const document = iframeRef.current.contentDocument;
        const content = `
      <!DOCTYPE html>
      <html>
        <head>
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

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--preview-bg)' }}>
            <div style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--bg-color)',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.9rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                color: 'var(--secondary-color)'
            }}>
                Preview
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