// Define an interface for the job application form data
export interface JobApplication {
    name: string;          // User's name
    email: string;         // User's email
    experience: string;    // User's experience level
    resume: File | null;   // User's uploaded resume (File object or null if no file)
    coverLetter: string;   // User's cover letter
  }
  // src/models/job-application-response.model.ts
export interface JobApplicationResponse {
  success: boolean;      // Indicates if the submission was successful
  message: string;       // A message returned from the server
  applicationId?: string; // Optional: ID of the submitted application, if applicable
}
