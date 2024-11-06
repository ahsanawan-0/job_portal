// helpers/fileRetrieval.js

const { google } = require('googleapis');
const path = require('path');

// Load service account credentials
const SERVICE_ACCOUNT_FILE = path.join(__dirname, '..', 'helpers', 'angular-436922-3b1a603e8eb2.json');
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // Read-only access
});

// Function to retrieve a file by its ID
async function getFileById(fileId) {
  const drive = google.drive({ version: 'v3', auth });
  
  try {
    const response = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, webContentLink, webViewLink', // Adjust fields as needed
    });
    return response.data; // Returns file metadata
  } catch (error) {
    console.error("Error fetching file:", error);
    throw new Error('Error fetching file from Google Drive');
  }
}

module.exports = { getFileById };