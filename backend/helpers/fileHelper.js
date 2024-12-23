const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Load service account credentials
const SERVICE_ACCOUNT_FILE = path.join(
  __dirname,
  process.env.GOOGLE_DRIVE_FILE
);
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

// Function to upload file to a specific Google Drive folder
async function uploadFile(filePath, mimeType, folderId) {
  const drive = google.drive({ version: "v3", auth });
  const fileMetadata = {
    name: path.basename(filePath),
    parents: [folderId],
  };

  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id",
  });

  return response.data.id; // Returns the file ID
}

module.exports = { uploadFile };
