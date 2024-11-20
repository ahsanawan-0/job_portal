// src/models/jobModel.ts

export interface PostJob {
  jobTitle: string;
  tags: string[]; // Changed to array of strings
  location: string;
  minSalary: number;
  maxSalary: number;
  education: string;
  experience: string;
  jobType: string;
  vacancies: number;
  expirationDate: string; // Can also be Date if preferred
  description: string;
  responsibilities: string;
}
export interface ApiPostModel {
  job: {
    _id: string;
    jobTitle: string;
    description: string;
    education: string;
    experience: string;
    expirationDate: string;
    jobType: string;
    location: string;
    maxSalary: number;
    minSalary: number;
    responsibilities: string;
    tags: string[];
    vacancies: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
// models/jobResponse.interface.ts
export interface JobResponse {
  count: number; // Total number of jobs found
  jobs: Job[]; // Array of Job objects
}
export interface Job {
  id: string; // Unique identifier for the job
  jobTitle: string; // Title of the job
  noOfApplications: number; // Number of applications for the job
  status: 'Active' | 'Inactive'; // Status of the job (Active or Inactive)
  createdDate: Date; // Date the job was created
}
export interface Question {
  label: string;
  type: string;
  options?: string[]; // Adjust the type based on your actual options structure
}
interface Evaluation {
  questionId: string;
  questionText: string;
  options: string[]; // Ensure this is always an array
  givenAnswer: string;
  correctnessPercentage: number;
  remarks: string;
  correctAnswer: string;
}

export interface SubmissionData {
  applicant: {
    id: string;
    name: string;
    email: string;
  };
  formId: string;
  evaluations: Evaluation[];
}
// Define the structure of an application
export interface Application {
  _id: string;
  name: string;
  experience: string;
  resume: string;
  jobId: string; // If needed
  appliedAt: string; // Date string
}
export interface Duplicate {
  jobId: string;
  jobTitle: string;
}

// Define the structure of an applicant
export interface Applicant {
  _id: string;
  email: string;
  applications: Application[];
  duplicates: Duplicate[];

}

// Define the response structure
export interface ApplicantsResponse {
  message: string;
  response: {
      applicants: Applicant[];
      jobTitle: string;
      expirationDate: string;
      status: string;
  };
  totalApplicants: number;
}
export interface TestInvitedApplicants {
  message: string;
  response: {
    testInvitedApplicants: Applicant[];
      jobTitle: string;
  };
  totalApplicants: number;
}
export interface ShortApplicantsResponse {
  message: string;
  response: {
    shortListedApplicants: Applicant[];
      jobTitle: string;
  };
  totalApplicants: number;
}
export interface QuestionCard {
  _id: string;
  num_questions: number;
  interview_type: string;
  experience_level: string;
  field: string;
  createdAt: Date; // Include createdAt if you want to show it
  job_id: string;
}
export interface FormCard {
  id: string;
  title: string;
  applicants: string[];
}

export interface jobCard {
  id: string;
  title: string;
  type: string;
  remaining: string;
  status: string;
  applications: number;
  expirationDate: string;
  applicants: string[];
}

export interface ReviewFormData {
  _id: string;
  title: string;
  questions: Question[];
  uniqueLinkId: string;
}
