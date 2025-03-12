import { cloudinaryClient } from "../../../lib/config/cloudinary";

const fileToBase64 = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString("base64")}`;
};

export async function POST(req) {
  try {
    // Get form data
    const formData = await req.formData();
    const file = formData.get("file");

    // Validate file
    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ message: "No file uploaded or invalid file" }), { status: 400 });
    }

    // File type and size validation
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ message: "Invalid file type. Only images are allowed." }), { status: 400 });
    }

    if (file.size > maxSize) {
      return new Response(JSON.stringify({ message: "File size exceeds the limit of 5MB." }), { status: 400 });
    }

    // Convert file to Base64
    const base64String = await fileToBase64(file);

    // Upload to Cloudinary
    const uploadResponse = await cloudinaryClient.uploader.upload(base64String, {
      folder: "profile",
      resource_type: "image",
    });

    // Return success message
    return new Response(
      JSON.stringify({
        message: "File uploaded successfully!",
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
        type: uploadResponse.resource_type,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return new Response(JSON.stringify({ message: "Error uploading image to Cloudinary" }), { status: 500 });
  }
}
