'use client';

import { useState } from 'react';

const ImageUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      if (onUploadSuccess) {
        onUploadSuccess(data.image);
      }

      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Select Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto rounded"
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={isUploading || !file}
          className={`px-4 py-2 rounded text-white ${
            isUploading || !file ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
    </div>
  );
};

export default ImageUpload;