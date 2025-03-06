import { cloudinaryClient } from "../../../lib/config/cloudinary";

const fileToBuffer = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export async function POST(req) {
  try {
    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get("file");

    // Check if the file is valid
    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ message: "No file uploaded or invalid file" }), {
        status: 400,
      });
    }

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ message: "Invalid file type. Only images are allowed." }), {
        status: 400,
      });
    }

    if (file.size > maxSize) {
      return new Response(JSON.stringify({ message: "File size exceeds the limit of 5MB." }), {
        status: 400,
      });
    }

    // Convert the file into a buffer
    const fileBuffer = await fileToBuffer(file);

    // Upload the file buffer to Cloudinary
    const uploadResponse = await cloudinaryClient.uploader.upload(fileBuffer, {
      folder: "profile", // Optional: specify a folder in Cloudinary
      resource_type: "auto", // Automatically detect file type (image, video, etc.)
    });

    // Return the Cloudinary URL and other details
    return new Response(
      JSON.stringify({
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
        type: uploadResponse.resource_type,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    let errorMessage = "Error uploading image to Cloudinary";
    if (error.message.includes("File size too large")) {
      errorMessage = "File size exceeds the allowed limit.";
    } else if (error.message.includes("Invalid file type")) {
      errorMessage = "Invalid file type. Only images are allowed.";
    }
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
    });
  }
}