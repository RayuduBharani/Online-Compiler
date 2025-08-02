const express = require('express');
const cors = require('cors');
const app = express()
const fs = require('fs');
const {spawn} = require('child_process');

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Server is running")
})


app.post('/run-python', (req, res) => {
    console.log("Received Python code to execute");
    // Here you would typically execute the Python code using a child process or similar method and it will take user inputs as well
    const { code, inputs } = req.body;
    if (!code) {
        return res.status(400).send("No code provided");
    }    
    // console.log(code , inputs)
    // add the inputs to the code execution logic
    const data = {
        code: code,
        inputs: inputs
    };
    
    // Modify the code to suppress input prompts from output
    const modifiedCode = modifyCodeToSuppressInputPrompts(data.code);
    
    // i need a way to execute the python code with inputs
    const filePath = 'temp.py'; // Replace with your Python script path
    fs.writeFileSync(filePath, modifiedCode, 'utf8', (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            return res.status(500).send("Error writing to file");
        }
    });
    const python = spawn('python', [filePath]);
    let output = '';
    let error = '';
    if (inputs) {
        python.stdin.write(inputs);
        python.stdin.end();
    }
    python.stdout.on('data', (data) => {
        output += data.toString();
    });
    python.stderr.on('data', (data) => {
        error += data.toString();
    });

    python.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            return res.status(500).send(`Error executing Python script: ${error}`);
        }
        console.log("Python script executed successfully");
        res.json({ output: filterInputPrompts(output, inputs) });
    });
})

// Function to modify Python code to suppress input prompts
function modifyCodeToSuppressInputPrompts(code) {
    let modifiedCode = code;
    
    if (!code.includes('import sys')) {
        modifiedCode = 'import sys\n' + modifiedCode;
    }
    if (!code.includes('import os')) {
        modifiedCode = 'import os\n' + modifiedCode;
    }
    
    // Use a more precise regex to handle input() calls
    modifiedCode = modifiedCode.replace(
        /input\s*\(\s*"([^"]*)"\s*\)/g,
        (match, prompt) => {
            return `(lambda: (sys.stderr.write("${prompt}"), input())[1])()`;
        }
    );
    
    // Also handle input() calls with single quotes
    modifiedCode = modifiedCode.replace(
        /input\s*\(\s*'([^']*)'\s*\)/g,
        (match, prompt) => {
            return `(lambda: (sys.stderr.write("${prompt}"), input())[1])()`;
        }
    );
    
    console.log('Original code:', code);
    console.log('Modified code:', modifiedCode);
    
    return modifiedCode;
}

// Function to filter out input prompts from output
function filterInputPrompts(output, inputs) {
    return output;
}


app.listen(8000 , ()=> {
    console.log("Server is running")
})

