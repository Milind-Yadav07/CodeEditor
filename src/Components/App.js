import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Editor from './Editor';
import useLocalStorage from '../Hooks/useLocalStorage';
import Layout from './layout';

function App() {
  // State variables for code in different languages, persisted in local storage
  const [html, setHtml] = useLocalStorage('html', '');
  const [css, setCss] = useLocalStorage('css', '');
  const [js, setJs] = useLocalStorage('js', '');
  const [python, setPython] = useLocalStorage('python', '');
  const [java, setJava] = useLocalStorage('java', '');

  // State for the combined source document to render in iframe for HTML/CSS/JS preview
  const [srcDoc, setSrcDoc] = useState('');

  // Tracks which editor is currently selected by the user
  const [selectedEditor, setSelectedEditor] = useState('HTML/CSS');

  // Output states for Python and Java code execution results
  const [pythonOutput, setPythonOutput] = useState('');
  const [javaOutput, setJavaOutput] = useState('');

  // Ref to hold the Pyodide instance for running Python code in the browser
  const pyodideRef = useRef(null);

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

  // Effect to update the output preview based on selected editor and code changes
  useEffect(() => {
    let timeoutId;

    // Clear outputs when dark mode is enabled for Python and Java editors
    if (darkMode) {
      if (selectedEditor === 'Python') setPythonOutput('');
      if (selectedEditor === 'Java') setJavaOutput('');
    }

    if (selectedEditor === 'HTML/CSS') {
      // Combine HTML, CSS, and JS into a single HTML document for iframe preview
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
      // Create an HTML document that captures console.log output for JS editor
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
    } else if (selectedEditor === 'Python') {
      // Run Python code asynchronously using Pyodide and capture output or errors
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
    } else if (selectedEditor === 'Java') {
      // Send Java code to backend API for execution and display the output or error
      timeoutId = setTimeout(async () => {
        try {
          const response = await fetch('http://localhost:5000/run-java', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: java }),
          });
          const data = await response.json();
          setJavaOutput(data.output || '');
        } catch {
          setJavaOutput('Error running Java code');
        }
      }, 500);
    } else {
      // Clear the source document if no editor is selected
      setSrcDoc('');
    }

    // Clear any pending timeout when dependencies change or component unmounts
    return () => clearTimeout(timeoutId);
  }, [html, css, js, python, java, selectedEditor, darkMode]);

  // Toggle sidebar open/close state
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  // Toggle dark mode on/off
  const toggleDarkMode = () => setDarkMode(!darkMode);
  // Set the currently selected editor tab
  const handleSelectEditor = (editor) => setSelectedEditor(editor);

  return (
    <>
      {/* Layout component handles sidebar, dark mode toggle, and editor selection */}
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
          {/* Conditionally render editors based on selected language */}
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
          {selectedEditor === 'Java' && (
            <Editor language="java" displayName="Java" value={java} onChange={setJava} darkMode={darkMode} />
          )}
        </div>
        <div className="pane">
          {/* Render output iframe based on selected editor */}
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
          ) : selectedEditor === 'Java' ? (
            <iframe
              srcDoc={"<html><body style='white-space: pre-wrap; font-size: 1.5rem; padding: 20px; margin: 0; color: black;'>" + javaOutput + "</body></html>"}
              title="java-output"
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
