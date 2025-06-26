import React from 'react';
import { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { EditorView } from '@codemirror/view';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faCss3Alt, faJs, faPython, faJsSquare } from '@fortawesome/free-brands-svg-icons';

// Editor component wraps the CodeMirror editor with language-specific syntax highlighting and theming
function Editor({ language, displayName, value, onChange, darkMode }) {
  // Memoized callback to handle changes in the editor content and propagate them to parent component
  const handleChange = useCallback((val) => {
    onChange(val);
  }, [onChange]);

  // Determine the CodeMirror extensions to use based on the selected language
  let extensions = [];
  switch (language) {
    case 'xml':
      extensions = [html(), EditorView.lineWrapping]; // Enable HTML syntax highlighting and line wrapping
      break;
    case 'css':
      extensions = [css(), EditorView.lineWrapping]; // Enable CSS syntax highlighting and line wrapping
      break;
    case 'javascript':
      extensions = [javascript(), EditorView.lineWrapping]; // Enable JavaScript syntax highlighting and line wrapping
      break;
    case 'python':
      extensions = [python(), EditorView.lineWrapping]; // Enable Python syntax highlighting and line wrapping
      break;
    case 'typescript':
      extensions = [javascript({ typescript: true }), EditorView.lineWrapping]; // Enable TypeScript syntax highlighting and line wrapping
      break;
    default:
      extensions = [EditorView.lineWrapping]; // Default to line wrapping only if language is not recognized
  }

  // Map language to corresponding icon component with color styles
  const languageIcons = {
    xml: <FontAwesomeIcon icon={faHtml5} className="language-icon" style={{ color: '#e34c26' }} />,
    css: <FontAwesomeIcon icon={faCss3Alt} className="language-icon" style={{ color: '#264de4' }} />,
    javascript: <FontAwesomeIcon icon={faJs} className="language-icon" style={{ color: '#f0db4f' }} />,
    python: <FontAwesomeIcon icon={faPython} className="language-icon" style={{ color: '#306998' }} />,
    typescript: <FontAwesomeIcon icon={faJsSquare} className="language-icon" style={{ color: '#007acc' }} />,
  };

  return (
    <div className="editor-container">
      {/* Display the name of the language or editor with icon */}
      <div className="editor-title">
        <span>{displayName}</span>
        <span>{languageIcons[language]}</span>
      </div>
      {/* Render the CodeMirror editor with the specified value, extensions, theme, and change handler */}
      <CodeMirror
        value={value}
        height="19.5rem"
        extensions={extensions}
        theme={darkMode ? 'dark' : 'light'}
        onChange={(value) => handleChange(value)}
      />
    </div>
  );
}

export default Editor;
