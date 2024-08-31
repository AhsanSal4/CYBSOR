// frontend/upload.js

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
  
    try {
      const response = await fetch('/upload', {
        method: 'POST', // Make sure this is set to POST
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('File uploaded successfully: ' + result.file.filename);
      } else {
        alert('Failed to upload file: ' + result.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  });
  