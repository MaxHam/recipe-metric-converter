'use client';
import { FileInput } from '@/components/ui/file-input';
import { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import ConvertMetrics from './ConvertMetrics';
import EditPhoto from './EditPhoto';

export default function Home() {
  const [source, setSource] = useState<string>('');
  const [text, setText] = useState<string>('');

  const handleCapture = (files: FileList | File[]) => {
    if (files) {
      const file = files[0];
      const newUrl = URL.createObjectURL(file);
      setSource(newUrl);
      doOCR(newUrl);
    }
  };
  const doOCR = (image: string) => {
    Tesseract.recognize(image, 'eng').then(({ data: { text } }) => {
      setText(text);
    });
  };

  const handleCrop = (image: string) => {
    doOCR(image);
  };

  return (
    <main className='flex min-h-screen w-xl flex-col items-center justify-between pt-5 pb-5 pl-5 md:pl-64 pr-5 md:pr-64'>
      {!source && (
        <div>
          <h1 className='scroll-m-20 text-4xl font-semibold tracking-tight'>
            Recipe Metric Converter.
          </h1>
          <h2 className='scroll-m-20 text-xl font-semibold tracking-tight'>
            Take a photo of your recipe to get cooking!
          </h2>
        </div>
      )}

      {source && <EditPhoto source={source} onChange={handleCrop} />}
      <div className='w-full flex flex-col justify-center items-center '>
        <FileInput onChange={handleCapture} />
        {source && <ConvertMetrics text={text} />}
      </div>
    </main>
  );
}
