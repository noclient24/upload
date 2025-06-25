'use client';

import { useState, useEffect } from 'react';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/images');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
      
      fetchImages();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) return <div className="text-center py-8">Loading images...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Image Gallery</h2>
      
      {images.length === 0 ? (
        <p className="text-center py-8">No images found. Upload some images!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image._id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
              <img
                src={image.url}
                alt={`Uploaded by ${image.userName}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <p className="font-medium">{image.userName}</p>
                <p className="text-sm text-gray-600">{image.userPhone}</p>
                <button
                  onClick={() => handleDelete(image._id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;