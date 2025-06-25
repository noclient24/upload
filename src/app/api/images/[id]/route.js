import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Image from '@/models/Image';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await dbConnect();
    const image = await Image.findById(id);

    if (!image) {
      return NextResponse.json(
        { message: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // Delete from MongoDB
    await Image.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { message: 'Error deleting image', error: error.message },
      { status: 500 }
    );
  }
}