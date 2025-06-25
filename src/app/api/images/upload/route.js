import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import cloudinary from '@/app/lib/cloudinary';
import dbConnect from '@/app/lib/dbConnect';
import Image from '@/app/models/Image';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

export async function POST(request) {
  await dbConnect();

  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    
    // Convert buffer to base64 string
    const base64String = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary using the base64 string
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'nextjs-uploads',
    });

    // Save to MongoDB
    const image = new Image({
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    });

    await image.save();

    return NextResponse.json({
      message: 'Image uploaded successfully',
      image,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Error uploading image', error: error.message },
      { status: 500 }
    );
  }
}