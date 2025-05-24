const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Initialize Express app and define the port to listen on
const app = express();
const port = 5000;

// Enable Cross-Origin Resource Sharing and JSON body parsing middleware
app.use(cors());
app.use(bodyParser.json());

// POST endpoint to receive Java code, compile and run it, then return the output
app.post('/run-java', (req, res) => {
  let { code } = req.body;

  // Validate that code is provided in the request body
  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  code = code.trim();

  // If code is empty after trimming, return empty output immediately
  if (code === '') {
    return res.json({ output: '' });
  }

  // Create a temporary directory to store Java files if it doesn't exist
  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // Extract the public class name from the code, default to 'Main' if not found
  const classNameMatch = code.match(/public\s+class\s+([A-Za-z_][A-Za-z0-9_]*)/);
  const className = classNameMatch ? classNameMatch[1] : 'Main';
  const fileName = `${className}.java`;
  const filePath = path.join(tempDir, fileName);

  // Write the Java code to a file in the temporary directory
  fs.writeFileSync(filePath, code);

  // Compile the Java file using javac
  exec(`javac ${fileName}`, { cwd: tempDir }, (compileErr, stdout, stderr) => {
    if (compileErr) {
      // On compilation error, clean up the source file and return the error output
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Cleanup error:', e);
      }
      return res.json({ output: stderr || compileErr.message });
    }

    // If compilation succeeds, run the compiled Java class
    exec(`java ${className}`, { cwd: tempDir }, (runErr, runStdout, runStderr) => {
      // Clean up the source and class files after execution
      try {
        fs.unlinkSync(filePath);
        const classFile = path.join(tempDir, `${className}.class`);
        if (fs.existsSync(classFile)) {
          fs.unlinkSync(classFile);
        }
      } catch (e) {
        console.error('Cleanup error:', e);
      }

      // Return runtime errors or standard output from the Java program
      if (runErr) {
        return res.json({ output: runStderr || runErr.message });
      }
      return res.json({ output: runStdout });
    });
  });
});

// Start the Express server and listen on the specified port
app.listen(port, () => {
  console.log(`Java runner listening at http://localhost:${port}`);
});
