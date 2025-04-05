'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;
      setImage(base64Image);

      // Create a canvas to resize the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new window.Image();
      img.src = base64Image;
      
      img.onload = () => {
        canvas.width = 60;
        canvas.height = 60;
        ctx.drawImage(img, 0, 0, 60, 60);
        
        // Convert to PNG
        const pngData = canvas.toDataURL('image/png');
        setConvertedImage(pngData);
        setLoading(false);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    
    const link = document.createElement('a');
    link.href = convertedImage;
    link.download = 'converted-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Image Converter</h1>
        
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {loading && <p className="text-gray-500">Converting image...</p>}

        <div className="grid grid-cols-2 gap-4 mt-6">
          {image && (
            <div>
              <h2 className="text-sm font-semibold mb-2">Original</h2>
              <Image
                src={image}
                alt="Original"
                width={200}
                height={200}
                className="border rounded"
              />
            </div>
          )}
          
          {convertedImage && (
            <div>
              <h2 className="text-sm font-semibold mb-2">Converted (60x60 PNG)</h2>
              <Image
                src={convertedImage}
                alt="Converted"
                width={200}
                height={200}
                className="border rounded"
              />
            </div>
          )}
        </div>

        {convertedImage && (
          <button
            onClick={handleDownload}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download PNG
          </button>
        )}
      </div>
    </main>
  );
}
