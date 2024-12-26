# Brainfk Web Interpreter

Interpret Brainfuck in this super awesome web interpreter!

- [Official Demo](https://brainfk-web-interpreter.netlify.app)

- Interpreter based on my [Python Interpreter](https://github.com/ILikeMice/python-brainfk-interpreter), optimized

# Features 

- **Cat :3 to help you through the process of having to write in this language**
- Access the interpreter from anywhere by sending a GET request to [this function](https://brainfk-web-interpreter.netlify.app/.netlify/functions/interpreter) with the code header being your code **( Make sure to encode it or else it wont receive the code correctly! E.g replace "+" with "%2B", usually only encoding the "+" characters should be enough)** 
- Create, Edit, Import, Export and Delete (empty name automatically deletes) Files!
- Run brainfk (real!)
- Convert Text from the input field to brainfk code to save time and pain
- Switch theme from dark to light (**use with caution!**)

# Made with...

- HTML
- Javascript
- CSS

- express and serverless-http libraries for making the interpreter accessable through the function

# How to Use

### Run Brainfk

1. Input your code into the code area
2. Click "Run"
3. Get your result in the output area!

### Convert Input Text to Brainfk

1. Input Text into the Input Area
2. Press "Input to Brainfk"
3. Have your code copied to your clipboard!

### Files

- Doubleclick Files to edit their Names

- Make a Filename Empty to delete it

- Click the "+" icon to create a new File!

- Press the "Export" Button to choose between exporting the current active file or all existing files

- Press the "Import" Button to import any file containing Brainfk code!

<br><br><br><br>

<sub><sup>Run button look plundered from https://www.online-python.com/ , cat appear/disappear sound taken and edited from [here](https://www.youtube.com/watch?v=zOnMIjl19g8)</sup></sub>
