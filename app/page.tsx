'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback((file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;
      setImage(base64Image);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new window.Image();
      img.src = base64Image;
      
      img.onload = () => {
        canvas.width = 60;
        canvas.height = 60;
        ctx.drawImage(img, 0, 0, 60, 60);
        
        const pngData = canvas.toDataURL('image/png');
        setConvertedImage(pngData);
        
        // 自动下载处理后的图片
        const link = document.createElement('a');
        const originalName = file.name.split('.')[0];
        link.href = pngData;
        link.download = `${originalName}_60x60.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setLoading(false);
      };
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processImage(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) processImage(file);
        break;
      }
    }
  };

  return (
    <main 
      className="min-h-screen p-8 bg-white"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#111212]">Logo Changer</h1>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn"
          >
            <PlusIcon className="btn-icon" />
            选择图片
          </button>
          <p className="mt-4 text-[#111212]">或者拖放一个文件/粘贴图片，上传完毕将自动下载</p>
          <p className="text-sm text-gray-400 mt-2">支持 JPG、PNG、GIF、WebP 等格式</p>
        </div>

        {loading && <p className="text-gray-500 text-center">正在处理图片...</p>}

        <div className="grid grid-cols-2 gap-8 mt-8">
          {image && (
            <div>
              <h2 className="text-sm font-semibold mb-2 text-[#111212]">原图</h2>
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
              <h2 className="text-sm font-semibold mb-2 text-[#111212]">转换后 (60x60 PNG)</h2>
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
      </div>
    </main>
  );
}
