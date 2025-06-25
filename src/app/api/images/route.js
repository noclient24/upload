import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Image from '@/app/models/Image';

export async function GET() {
  try {
    await dbConnect();
    const images = await Image.find().sort({ createdAt: -1 });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { message: 'Error fetching images', error: error.message },
      { status: 500 }
    );
  }
}