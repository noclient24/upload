"use client"

import { useRef, useState } from "react"
import { PhotoCards } from "./phtotoCrad"

export const UploadForm = () => {
  const formRef = useRef()
  const fileInputRef = useRef()
  const [files, setFiles] = useState([])
  const [error, setError] = useState("")
  
  const handleInputFields = (e) => {
    setError("")
    const selectedFiles = Array.from(e.target.files)
    
    if (selectedFiles.length === 0) return
    
    const validFiles = selectedFiles.filter(file => {
      if (file.size > 1024 * 1024) {
        setError(prev => prev ? prev : "Some files were too large (max 1MB)")
        return false
      }
      if (!file.type.startsWith("image/")) {
        setError(prev => prev ? prev : "Only image files are allowed")
        return false
      }
      return true
    })
    
    setFiles(prevFiles => [...prevFiles, ...validFiles])
  }

  const handleDelete = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  const handleClear = () => {
    formRef.current?.reset()
    setFiles([])
    setError("")
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (files.length === 0) return
    // Here you would typically handle the file upload
    console.log("Files to upload:", files)
    alert(`${files.length} files ready for upload!`)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Images
          </label>
          <div 
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-300 transition-colors duration-200"
            onClick={triggerFileInput}
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                >
                  <span>Upload files</span>
                  <input 
                    id="file-upload" 
                    ref={fileInputRef}
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    accept="image/*" 
                    multiple 
                    onChange={handleInputFields} 
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG up to 1MB
              </p>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 py-2 px-3 bg-red-50 rounded-md">{error}</p>
        )}
      
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Selected Files ({files.length}):
            </h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {files.map((file, index) => (
                <PhotoCards 
                  key={`${file.name}-${index}`} 
                  file={file} 
                  onDelete={() => handleDelete(index)} 
                />
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {files.length > 0 && (
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              onClick={handleClear}
            >
              Clear All
            </button>
          )}
          <button
            type="submit"
            className={`px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
              files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={files.length === 0}
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  )
}