// Function to convert a message into a matrix
function convertMessageToMatrix(message) {
  const charToNumber = (char) => {
    if (char === " ") return 0; // Space is 0
    const charCode = char.toUpperCase().charCodeAt(0);
    return charCode >= 65 && charCode <= 90 ? charCode - 64 : null; // A=1, ..., Z=26
  };

  const encodedMessage = message
    .split("")
    .map(charToNumber)
    .filter((num) => num !== null);

  const matrix = [];
  for (let i = 0; i < encodedMessage.length; i += 3) {
    matrix.push(encodedMessage.slice(i, i + 3));
  }

  const lastRow = matrix[matrix.length - 1];
  while (lastRow && lastRow.length < 3) {
    lastRow.push(0); // Pad the last row with zeros if necessary
  }

  return matrix;
}

// Function to retrieve the key matrix from user inputs
function getKeyMatrix(rows, cols) {
  const keyMatrix = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const inputId = `key-${i}-${j}`;
      const inputElement = document.getElementById(inputId);

      if (!inputElement) {
        console.error(`Input with ID '${inputId}' is missing or not found in the DOM.`);
        return null;
      }

      const value = parseInt(inputElement.value, 10);
      if (isNaN(value)) {
        console.warn(`Input with ID '${inputId}' has an invalid value. Defaulting to 0.`);
        row.push(0);
      } else {
        row.push(value);
      }
    }
    keyMatrix.push(row);
  }
  return keyMatrix;
}

// Function to multiply two matrices
function multiplyMatrices(A, B) {
  const result = [];
  for (let i = 0; i < A.length; i++) {
    const row = [];
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < A[0].length; k++) {
        sum += A[i][k] * B[k][j];
      }
      row.push(math.fraction(sum)); // Store results as fractions
    }
    result.push(row);
  }
  return result;
}

// Main event listener for form submission
document.getElementById("message-form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const message = document.getElementById("message").value;
  const rows = parseInt(document.getElementById("rowsB").value, 10);
  const cols = parseInt(document.getElementById("colsB").value, 10);

  // Convert the message to a matrix
  const messageMatrix = convertMessageToMatrix(message);

  // Retrieve the key matrix
  const keyMatrix = getKeyMatrix(rows, cols);
  if (!keyMatrix) {
    alert("Please ensure the key matrix inputs are properly set up before submitting.");
    return;
  }

  // Perform the first multiplication: message matrix * key matrix
  const resultMatrix = multiplyMatrices(messageMatrix, keyMatrix);

  // Calculate the inverse of the key matrix
  const inverseKeyMatrix = math.inv(math.matrix(keyMatrix));

  // Multiply the result matrix with the inverse key matrix
  const finalResultMatrix = multiplyMatrices(resultMatrix, inverseKeyMatrix.toArray());

  // Clear previous outputs
  const outputDiv = document.getElementById("matrix-output");
  outputDiv.innerHTML = "";

  // Helper function to display matrices in styled containers
  function displayMatrix(title, matrix) {
    const matrixDiv = document.createElement("div");
    matrixDiv.className =
      "bg-slate-50 p-4 m-2 rounded-md shadow-md inline-block align-top";
  
    // Title for the matrix
    const titleElement = document.createElement("h3");
    titleElement.className = "text-lg font-bold mb-2";
    titleElement.innerText = title;
    matrixDiv.appendChild(titleElement);
  
    // Display each row of the matrix
    matrix.forEach((row) => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "text-sm font-mono";
      // Format each value in the row as a fraction
      rowDiv.textContent = `[ ${row.map((val) => math.format(val)).join(", ")} ]`;
      matrixDiv.appendChild(rowDiv);
    });
  
    return matrixDiv;
  }

  // Row 1: Message Matrix and Key Matrix
  const row1 = document.createElement("div");
  row1.className = "flex justify-center mb-4";
  row1.appendChild(displayMatrix("Message Matrix", messageMatrix));
  row1.appendChild(displayMatrix("Key Matrix", keyMatrix));
  outputDiv.appendChild(row1);

  // Row 2: Result Matrix and Inverse Key Matrix
  const row2 = document.createElement("div");
  row2.className = "flex justify-center mb-4";
  row2.appendChild(displayMatrix("Result Matrix", math.number(resultMatrix)));
  row2.appendChild(
    displayMatrix("Inverse Key Matrix", math.fraction(inverseKeyMatrix.toArray()))
  );
  outputDiv.appendChild(row2);

  // Row 3: Final Result Matrix
  const row3 = document.createElement("div");
  row3.className = "flex justify-center";
  row3.appendChild(displayMatrix("Final Result", math.number(finalResultMatrix)));
  outputDiv.appendChild(row3);

  // final message
  const originalMessageDiv = document.createElement("div");
  originalMessageDiv.className = "bg-slate-50 p-4 m-2 rounded-md shadow-md mt-4 text-lg";
  originalMessageDiv.innerHTML = `<strong>Decrypted Message:</strong> ${message}`;
  outputDiv.appendChild(originalMessageDiv);
});

// Event listeners to dynamically update key matrix input fields
document.getElementById("rowsB").addEventListener("input", updateKeyMatrixInputs);
document.getElementById("colsB").addEventListener("input", updateKeyMatrixInputs);

// Function to update the input fields for the key matrix
function updateKeyMatrixInputs() {
  const rows = parseInt(document.getElementById("rowsB").value, 10);
  const cols = parseInt(document.getElementById("colsB").value, 10);
  const keyMatrixDiv = document.getElementById("key-matrix");

  keyMatrixDiv.innerHTML = ""; // Clear previous inputs

  // Heading for the key matrix
  const keyHead = document.createElement("h3");
  keyHead.innerText = "Enter Key Matrix";
  keyHead.className = "text-base sm:text-lg block text-blue-500";
  keyMatrixDiv.appendChild(keyHead);

  // Generate input fields for key matrix
  for (let i = 0; i < rows; i++) {
    const rowDiv = document.createElement("div");
    for (let j = 0; j < cols; j++) {
      const input = document.createElement("input");
      input.type = "number";
      input.id = `key-${i}-${j}`;
      input.className = "border-2 rounded-md border-yellow-500 p-1 m-1 w-1/4 sm:w-1/5 xl:w-1/6";
      input.required = true;
      rowDiv.appendChild(input);
    }
    keyMatrixDiv.appendChild(rowDiv);
  }
}
