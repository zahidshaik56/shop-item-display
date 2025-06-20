
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Check } from 'lucide-react';
import { Item } from '@/types/Item';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/hooks/use-toast';

const AddItem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    coverImage: '',
    additionalImages: [] as string[]
  });

  const itemTypes = ['Shirt', 'Pant', 'Shoes', 'Accessories', 'Jacket', 'Dress', 'Other'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoverImageChange = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      coverImage: imageUrl
    }));
  };

  const handleAdditionalImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: images
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.description || !formData.coverImage) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add a cover image.",
        variant: "destructive"
      });
      return;
    }

    const newItem: Item = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      description: formData.description,
      coverImage: formData.coverImage,
      additionalImages: formData.additionalImages,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingItems = JSON.parse(localStorage.getItem('shopItems') || '[]');
    const updatedItems = [...existingItems, newItem];
    localStorage.setItem('shopItems', JSON.stringify(updatedItems));

    toast({
      title: "Success!",
      description: "Item successfully added to your collection.",
    });

    // Reset form
    setFormData({
      name: '',
      type: '',
      description: '',
      coverImage: '',
      additionalImages: []
    });

    // Navigate back to view items after a short delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link 
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Items</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Add New Item</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Item Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter item name..."
                required
              />
            </div>

            {/* Item Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                Item Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
                <option value="">Select item type...</option>
                {itemTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Describe your item..."
                required
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Image *
              </label>
              <ImageUpload
                onImageChange={handleCoverImageChange}
                currentImage={formData.coverImage}
                isCoverImage={true}
              />
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Images
              </label>
              <ImageUpload
                onImagesChange={handleAdditionalImagesChange}
                currentImages={formData.additionalImages}
                isMultiple={true}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link
                to="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Check className="h-5 w-5" />
                <span>Add Item</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddItem;
