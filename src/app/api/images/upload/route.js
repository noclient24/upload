import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import cloudinary from '@/app/lib/cloudinary';
import dbConnect from '@/app/lib/dbConnect';
import Image from '@/app/models/Image';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userName = formData.get('userName');
    const userPhone = formData.get('userPhone');

    if (!file || !userName || !userPhone) {
      return NextResponse.json(
        { message: 'File, user name and phone are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'nextjs-uploads',
    });

    // Save to MongoDB
    const image = new Image({
      url: result.secure_url,
      userName,
      userPhone,
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