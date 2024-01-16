'use client';
import { FileInput } from '@/components/ui/file-input';
import { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import ConvertMetrics from './ConvertMetrics';
import CropPhoto from './CropPhoto';
import { isMobile } from 'react-device-detect';

export default function Home() {
  const [source, setSource] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [isSSR, setIsSSR] = useState<boolean>(true);

  const handleCapture = (files: FileList | File[]) => {
    if (files) {
      const file = files[0];
      const newUrl = URL.createObjectURL(file);
      setSource(newUrl);
      doOCR(newUrl);
    }
  };
  const doOCR = (image: string) => {
    setIsConverting(true);

    Tesseract.recognize(image, 'eng').then(({ data: { text } }) => {
      setText(text);
      setIsConverting(false);
    });
  };

  const handleCrop = (image: string) => {
    doOCR(image);
  };

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <main className='flex w-xl flex-col items-center justify-between pt-5 pb-5 pl-5 lg:pl-72 pr-5 lg:pr-72'>
      {(!source || !isMobile) && (
        <div className='flex flex-col justify-start w-full'>
          <h1 className='scroll-m-20 text-4xl font-semibold tracking-tight pb-2'>
            Recipe Metric Converter.
          </h1>
          <h2 className='scroll-m-20 text-xl font-semibold tracking-tight'>
            {isMobile
              ? ' Take a photo of your recipe.'
              : 'Upload a photo of your recipe.'}
            <br />
            Convert from{' '}
            <mark className='bg-orange-200 pr-1 pl-1'>imperial</mark> to{' '}
            <mark className='bg-yellow-200 pr-1 pl-1'>metric</mark> units and
            get cooking!
          </h2>
        </div>
      )}

      {source && <CropPhoto source={source} onChange={handleCrop} />}
      <div className='w-full flex flex-col justify-start items-center '>
        <FileInput onChange={handleCapture} />
        {source && <ConvertMetrics isConverting={isConverting} text={text} />}
      </div>
    </main>
  );
}
