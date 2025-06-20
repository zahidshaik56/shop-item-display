
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageChange?: (imageUrl: string) => void;
  onImagesChange?: (imageUrls: string[]) => void;
  currentImage?: string;
  currentImages?: string[];
  isCoverImage?: boolean;
  isMultiple?: boolean;
}

const ImageUpload = ({ 
  onImageChange, 
  onImagesChange, 
  currentImage, 
  currentImages = [], 
  isCoverImage = false, 
  isMultiple = false 
}: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          
          if (isCoverImage && onImageChange) {
            onImageChange(imageUrl);
          } else if (isMultiple && onImagesChange) {
            const newImages = [...currentImages, imageUrl];
            onImagesChange(newImages);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (indexToRemove?: number) => {
    if (isCoverImage && onImageChange) {
      onImageChange('');
    } else if (isMultiple && onImagesChange && indexToRemove !== undefined) {
      const newImages = currentImages.filter((_, index) => index !== indexToRemove);
      onImagesChange(newImages);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (isCoverImage && currentImage) {
    return (
      <div className="relative">
        <div className="relative aspect-square max-w-xs mx-auto bg-gray-50 rounded-lg overflow-hidden">
          <img 
            src={currentImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => removeImage()}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={openFileDialog}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          Change image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <div className="space-y-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Upload className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              {dragActive ? 'Drop images here' : 'Upload images'}
            </p>
            <p className="text-gray-600">Drag and drop or click to select</p>
          </div>
        </div>
      </div>

      {/* Preview Grid for Multiple Images */}
      {isMultiple && currentImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {currentImages.map((image, index) => (
            <div key={index} className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img 
                src={image} 
                alt={`Preview ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={isMultiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
