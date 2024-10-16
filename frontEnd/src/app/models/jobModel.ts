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
