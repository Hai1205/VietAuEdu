import { ICreateJobData, IUpdateJobData } from "../controllers/job.controller.js";
import { Job } from "../models/job.model.js";
import { ErrorCustom, HandlerCustom } from "../utils/configs/custom.js";

export const handleGetAllJobs = HandlerCustom(async () => {
  const jobs = await Job
    .find()
    .exec();

  return jobs;
});

export const handleGetJobById = HandlerCustom(async (data: { id: string }) => {
  const jobs = await Job
    .findById({ _id: data.id })
    .exec();

  return jobs;
});

export const handleCreateJob = HandlerCustom(async (data: ICreateJobData) => {
  // Sử dụng imageUrl từ Cloudinary nếu có
  const job = await new Job({
    title: data.title,
    country: data.country,
    imageUrl: data.imageUrl || "/images/placeholder-job.jpg", // Sử dụng ảnh mặc định nếu không có
    positions: data.positions,
    location: data.location,
    salary: data.salary,
    applicationDeadline: data.applicationDeadline,
    estimatedDeparture: data.estimatedDeparture,
    requirements: data.requirements,
    benefits: data.benefits,
    description: data.description,
    company: data.company,
    workType: data.workType,
    featured: data.featured,
    workingHours: data.workingHours,
    overtime: data.overtime,
    accommodation: data.accommodation,
    workEnvironment: data.workEnvironment,
    trainingPeriod: data.trainingPeriod,
  }).save();

  return job;
});

export const handleUpdateJob = HandlerCustom(async (data: { id: string } & Partial<IUpdateJobData>) => {
  const job = await Job.findById(data.id);

  if (!job) {
    throw new ErrorCustom(404, "Job not found");
  }

  // Cập nhật các trường được cung cấp
  if (data.title !== undefined) job.title = data.title;
  if (data.country !== undefined) job.country = data.country;
  if (data.imageUrl !== undefined) job.imageUrl = data.imageUrl; // Sử dụng URL từ Cloudinary
  if (data.positions !== undefined) job.positions = data.positions;
  if (data.location !== undefined) job.location = data.location;
  if (data.salary !== undefined) job.salary = data.salary;
  if (data.applicationDeadline !== undefined) job.applicationDeadline = data.applicationDeadline;
  if (data.estimatedDeparture !== undefined) job.estimatedDeparture = data.estimatedDeparture;
  if (data.requirements !== undefined) job.requirements = data.requirements;
  if (data.benefits !== undefined) job.benefits = data.benefits;
  if (data.description !== undefined) job.description = data.description;
  if (data.company !== undefined) job.company = data.company;
  if (data.workType !== undefined) job.workType = data.workType;
  if (data.featured !== undefined) job.featured = data.featured;
  if (data.workingHours !== undefined) job.workingHours = data.workingHours;
  if (data.overtime !== undefined) job.overtime = data.overtime;
  if (data.accommodation !== undefined) job.accommodation = data.accommodation;
  if (data.workEnvironment !== undefined) job.workEnvironment = data.workEnvironment;
  if (data.trainingPeriod !== undefined) job.trainingPeriod = data.trainingPeriod;

  const updatedJob = await job.save();
  return updatedJob;
});