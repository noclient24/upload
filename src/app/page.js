"use client"

import { useState } from 'react';
import Head from 'next/head';
import ImageUpload from './components/ImageUpload';
import ImageGallery from './components/ImageGallery';



export default function Home() {
  const [refreshGallery, setRefreshGallery] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshGallery(!refreshGallery); // Toggle to trigger refresh
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Image Upload with Cloudinary and MongoDB</title>
        <meta name="description" content="Upload images to Cloudinary and store metadata in MongoDB" />
      </Head>

      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Image Upload with Cloudinary and MongoDB
        </h1>
        
        <div className="mb-12">
          <ImageUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        <ImageGallery key={refreshGallery} />
      </main>
    </div>
  );
}