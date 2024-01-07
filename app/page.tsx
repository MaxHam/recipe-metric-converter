'use client';
import { FileInput } from '@/components/ui/file-input';
import { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import ConvertMetrics from './ConvertMetrics';
import EditPhoto from './EditPhoto';

export default function Home() {
  const [source, setSource] = useState<string>('');
  const [finalImageURL, setFinalImageURL] = useState<string>(source);
  const [text, setText] = useState<string>('');

  const handleCapture = (files: FileList | File[]) => {
    if (files) {
      const file = files[0];
      const newUrl = URL.createObjectURL(file);
      setSource(newUrl);
    }
  };

  const handleCrop = (image: string) => {
    console.log(image);
    setFinalImageURL(image);
  };

  useEffect(() => {
    if (!finalImageURL) return;

    Tesseract.recognize(finalImageURL, 'eng').then(({ data: { text } }) => {
      setText(text);
    });
  }, [finalImageURL]);

  return (
    <main className='flex min-h-screen w-xl flex-col items-center justify-between p-5'>
      {!source && (
        <div>
          <h1 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
            Imperial to Metric
          </h1>
          <h2 className='scroll-m-20 text-xl font-semibold tracking-tight'>
            Take a photo of your recipe to get started!
          </h2>
        </div>
      )}

      {source && <EditPhoto source={source} onChange={handleCrop} />}
      <div className='w-full grid grid-flow-row gap-2'>
        <FileInput onChange={handleCapture} />
        {source && <ConvertMetrics text={text} />}
      </div>
    </main>
  );
}
