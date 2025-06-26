import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Editor from './components/Editor';
import useLocalStorage from './storage/UseLocalStorage';
import Layout from './components/Layout';

function App() {
  // State variables for code in different languages, persisted in local storage
  const [html, setHtml] = useLocalStorage('html', '');
  const [css, setCss] = useLocalStorage('css', '');
  const [js, setJs] = useLocalStorage('js', '');
  const [python, setPython] = useLocalStorage('python', '');
  const [typescript, setTypescript] = useLocalStorage('typescript', '');

  // State for the combined source document to render in iframe for HTML/CSS/JS preview
  const [srcDoc, setSrcDoc] = useState('');

  // Tracks which editor is currently selected by the user
  const [selectedEditor, setSelectedEditor] = useState('HTML/CSS');

  // Output states for Python code execution results
  const [pythonOutput, setPythonOutput] = useState('');

  // Ref to hold the Pyodide instance for running Python code in the browser
  const pyodideRef = useRef(null);

  // State to track if TypeScript compiler is loaded
  const [tsLoaded, setTsLoaded] = useState(false);

  // State to hold transpiled TypeScript output
  const [transpiledTs, setTranspiledTs] = useState('');

  // UI state for sidebar visibility and dark mode toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load Pyodide script and initialize Pyodide instance on component mount
  useEffect(() => {
    async function loadPyodide() {
      if (!window.loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
        document.body.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }
      pyodideRef.current = await window.loadPyodide();
    }
    loadPyodide();
  }, []);

  // Load TypeScript compiler script dynamically on component mount
  useEffect(() => {
    if (!window.ts) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/typescript@4.9.5/lib/typescript.js';
      script.onload = () => setTsLoaded(true);
      script.onerror = () => console.error('Failed to load TypeScript compiler');
      document.body.appendChild(script);
    } else {
      setTsLoaded(true);
    }
  }, []);

  // Effect to update the output preview based on selected editor and code changes
  useEffect(() => {
    let timeoutId;

    if (darkMode) {
      if (selectedEditor === 'Python') setPythonOutput('');
    }

    if (selectedEditor === 'HTML/CSS') {
      timeoutId = setTimeout(() => {
        setSrcDoc(
          "<html>" +
          "<body>" + html + "</body>" +
          "<style>" + css + "</style>" +
          "<script>" + js + "</script>" +
          "</html>"
        );
      }, 250);
    } else if (selectedEditor === 'JavaScript') {
      timeoutId = setTimeout(() => {
        setSrcDoc(
          "<html>" +
          "<head>" +
          "<style>" +
          "#output { font-size: 1.5rem; padding: 20px; }" +
          "</style>" +
          "</head>" +
          "<body>" +
          "<div id='output'></div>" +
          "<script>" +
          "(function() {" +
          "const outputDiv = document.getElementById('output');" +
          "console.log = function(msg) {" +
          "if (typeof msg === 'object') { msg = JSON.stringify(msg); }" +
          "outputDiv.innerHTML += msg + '<br>';" +
          "};" +
          "console.error = console.log;" +
          "try { " + js + " } catch (e) { console.log(e); }" +
          "})();" +
          "</script>" +
          "</body>" +
          "</html>"
        );
      }, 250);
    } else if (selectedEditor === 'TypeScript') {
      timeoutId = setTimeout(() => {
          setSrcDoc(
            "<html>" +
            "<head>" +
            "<style>" +
            "#output { font-size: 1.5rem; padding: 20px; }" +
            "</style>" +
            "</head>" +
            "<body>" +
            "<div id='output'></div>" +
            "<script>" +
            "(function() {" +
            "const outputDiv = document.getElementById('output');" +
            "console.log = function(msg) {" +
            "if (typeof msg === 'object') { msg = JSON.stringify(msg); }" +
            "outputDiv.innerHTML += msg + '<br>';" +
            "};" +
            "console.error = console.log;" +
            "try { " + transpiledTs + " } catch (e) { console.log(e); }" +
            "})();" +
            "</script>" +
            "</body>" +
            "</html>"
          );
      }, 250);
    } else if (selectedEditor === 'Python') {
      timeoutId = setTimeout(async () => {
        if (pyodideRef.current) {
          try {
            await pyodideRef.current.runPythonAsync(
              "import sys\n" +
              "from io import StringIO\n" +
              "sys.stdout = StringIO()\n" +
              "sys.stderr = StringIO()\n"
            );
            await pyodideRef.current.runPythonAsync(python);
            const output = pyodideRef.current.runPython('sys.stdout.getvalue() + sys.stderr.getvalue()');
            setPythonOutput(output);
          } catch (err) {
            setPythonOutput(err.toString());
          }
        }
      }, 500);
    } else {
      setSrcDoc('');
    }

    return () => clearTimeout(timeoutId);
  }, [html, css, js, python, typescript, selectedEditor, darkMode, tsLoaded]);

  // Effect to transpile TypeScript code when it or tsLoaded changes
  useEffect(() => {
    if (tsLoaded && window.ts) {
      try {
        const result = window.ts.transpileModule(typescript, {
          compilerOptions: { module: window.ts.ModuleKind.ESNext, target: window.ts.ScriptTarget.ES2017 },
        });
        setTranspiledTs(result.outputText);
      } catch (err) {
        setTranspiledTs(`console.error('TypeScript transpilation error: ' + ${JSON.stringify(err.message)});`);
      }
    }
  }, [typescript, tsLoaded]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleSelectEditor = (editor) => setSelectedEditor(editor);

  return (
    <>
      <Layout
        onSelectEditor={handleSelectEditor}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <div
        className="main-content"
        style={{
          transition: 'transform 0.3s ease',
          marginLeft: sidebarOpen ? '200px' : '0',
          paddingTop: '60px',
        }}
      >
        <div className="pane top-pane" style={{ display: 'flex', gap: '10px' }}>
          {selectedEditor === 'HTML/CSS' && (
            <>
              <Editor language="xml" displayName="HTML" value={html} onChange={setHtml} darkMode={darkMode} />
              <Editor language="css" displayName="CSS" value={css} onChange={setCss} darkMode={darkMode} />
            </>
          )}
          {selectedEditor === 'JavaScript' && (
            <Editor language="javascript" displayName="JavaScript" value={js} onChange={setJs} darkMode={darkMode} />
          )}
          {selectedEditor === 'Python' && (
            <Editor language="python" displayName="Python" value={python} onChange={setPython} darkMode={darkMode} />
          )}
          {selectedEditor === 'TypeScript' && (
            <Editor language="typescript" displayName="TypeScript" value={typescript} onChange={setTypescript} darkMode={darkMode} />
          )}
        </div>
        <div className="pane">
          {selectedEditor === 'Python' ? (
            <iframe
              srcDoc={"<html><body style='white-space: pre-wrap; font-size: 1.5rem; padding: 20px; color: black;'>" + pythonOutput.replace(/\n/g, '<br>') + "</body></html>"}
              title="python-output"
              sandbox="allow-scripts allow-same-origin"
              frameBorder="0"
              width="100%"
              height="100%"
              style={{ backgroundColor: '#fff', borderRadius: '4px' }}
            />
          ) : (
            <iframe
              srcDoc={srcDoc}
              title="output"
              sandbox="allow-scripts allow-same-origin"
              frameBorder="0"
              width="100%"
              height="100%"
              style={{ backgroundColor: '#fff' }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
