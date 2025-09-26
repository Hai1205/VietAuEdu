import { ICreateProgramData, IUpdateProgramData } from "../controllers/program.controller.js";
import { Program } from "../models/program.model.js";
import { ErrorCustom, HandlerCustom } from "../utils/configs/custom.js";

export const handleGetPrograms = HandlerCustom(async (data: { featured?: boolean }) => {
    const filter: { featured?: boolean } = {};

    if (data.featured === true) {
        filter.featured = true;
    }

    const programs = await Program
        .find(filter)
        .sort({ createdAt: -1 })
        .exec();

    return programs;
});

export const handleGetProgramById = HandlerCustom(async (data: { id: string }) => {
    const program = await Program
        .findById({ _id: data.id })
        .exec();

    return program;
});

export const handleCreateProgram = HandlerCustom(async (data: ICreateProgramData) => {
    const program = await new Program({
        title: data.title,
        description: data.description,
        country: data.country,
        duration: data.duration,
        tuition: data.tuition,
        requirements: data.requirements,
        benefits: data.benefits,
        imageUrl: data.imageUrl || "/images/placeholder-program.jpg", // Sử dụng ảnh mặc định nếu không có
        featured: data.featured,
        status: data.status,
    }).save();

    return program;
});

export const handleUpdateProgram = HandlerCustom(async (data: { id: string } & Partial<IUpdateProgramData>) => {
    const program = await Program.findById(data.id);

    if (!program) {
        throw new ErrorCustom(404, "Program not found");
    }

    // Cập nhật các trường được cung cấp
    if (data.title !== undefined) program.title = data.title;
    if (data.description !== undefined) program.description = data.description;
    if (data.country !== undefined) program.country = data.country;
    if (data.duration !== undefined) program.duration = data.duration;
    if (data.tuition !== undefined) program.tuition = data.tuition;
    if (data.imageUrl !== undefined) program.imageUrl = data.imageUrl;
    if (data.requirements !== undefined) program.requirements = data.requirements;
    if (data.benefits !== undefined) program.benefits = data.benefits;
    if (data.featured !== undefined) program.featured = data.featured;
    if (data.status !== undefined) program.status = data.status;

    const updatedProgram = await program.save();
    return updatedProgram;
});