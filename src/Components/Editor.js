import React from 'react';
import { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { EditorView } from '@codemirror/view';

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
    case 'java':
      extensions = [java(), EditorView.lineWrapping]; // Enable Java syntax highlighting and line wrapping
      break;
    default:
      extensions = [EditorView.lineWrapping]; // Default to line wrapping only if language is not recognized
  }

  return (
    <div className="editor-container">
      {/* Display the name of the language or editor */}
      <div className="editor-title">{displayName}</div>
      {/* Render the CodeMirror editor with the specified value, extensions, theme, and change handler */}
      <CodeMirror
        value={value}
        height="20rem"
        extensions={extensions}
        theme={darkMode ? 'dark' : 'light'}
        onChange={(value) => handleChange(value)}
      />
    </div>
  );
}

export default Editor;
