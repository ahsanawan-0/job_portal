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
  jobs: Job[];   // Array of Job objects
}
export interface Job {
  id: string;                  // Unique identifier for the job
  jobTitle: string;           // Title of the job
  noOfApplications: number;   // Number of applications for the job
  status: 'Active' | 'Inactive'; // Status of the job (Active or Inactive)
  createdDate: Date;          // Date the job was created
}
