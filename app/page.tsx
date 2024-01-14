'use client';
import { FileInput } from '@/components/ui/file-input';
import { useState } from 'react';
import Tesseract from 'tesseract.js';
import ConvertMetrics from './ConvertMetrics';
import EditPhoto from './EditPhoto';
import { isMobile } from 'react-device-detect';

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
    <main className='flex w-xl flex-col items-center justify-between pt-5 pb-5 pl-5 md:pl-64 pr-5 md:pr-64'>
      {(!source || !isMobile) && (
        <div className='flex flex-col justify-start w-full'>
          <h1 className='scroll-m-20 text-4xl font-semibold tracking-tight pb-2'>
            Recipe Metric{' '}
            <mark className='bg-yellow-200 pr-1 pl-1'>Converter</mark>.
          </h1>
          <h2 className='scroll-m-20 text-xl font-semibold tracking-tight pb-4'>
            Take a photo of your recipe and get cooking!
          </h2>
        </div>
      )}

      {source && <EditPhoto source={source} onChange={handleCrop} />}
      <div className='w-full flex flex-col justify-start items-center '>
        <FileInput onChange={handleCapture} />
        {source && <ConvertMetrics text={text} />}
      </div>
    </main>
  );
}
