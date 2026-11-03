import supabase from "../config/supabase.js";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const uploadResume = async (resume) => {
  const extension = path.extname(resume.name).toLowerCase();

  if (
    extension !== ".pdf" ||
    resume.mimetype !== "application/pdf"
  ) {
    throw new Error("Only PDF files are allowed");
  }

  if (resume.size > 5 * 1024 * 1024) {
    throw new Error("Resume must be less than 5 MB");
  }

  const fileBuffer = await fs.readFile(resume.tempFilePath);

  const fileName = `${crypto.randomUUID()}.pdf`;
  const filePath = `job-seekers/${fileName}`;

  console.log("UPLOAD BUCKET:", process.env.SUPABASE_BUCKET);
console.log("UPLOAD FILE PATH:", filePath);

  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(filePath, fileBuffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) throw new Error(error.message);

// Generate public URL
const { data: urlData } = supabase.storage
  .from(process.env.SUPABASE_BUCKET)
  .getPublicUrl(data.path);

return {
  path: data.path,
  url: urlData.publicUrl,
};
};