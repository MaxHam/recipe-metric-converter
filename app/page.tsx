'use client';
import { FileInput } from '@/components/ui/file-input';
import Image from 'next/image';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import Tesseract from 'tesseract.js';
import EditPhoto from './EditPhoto';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MetricDropdown } from '@/components/metric-dropdown';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ConvertMetrics from './ConvertMetrics';

export default function Home() {
  const [source, setSource] = useState<string>('');
  const [text, setText] = useState<string>('');

  const handleCapture = (files: FileList | File[]) => {
    if (files) {
      const file = files[0];
      const newUrl = URL.createObjectURL(file);
      setSource(newUrl);

      Tesseract.recognize(file, 'eng').then(({ data: { text } }) => {
        setText(text);
      });
    }
  };

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

      {source && <EditPhoto source={source} />}
      <div className='w-full grid grid-flow-row gap-2'>
        <FileInput onChange={handleCapture} />
        {source && <ConvertMetrics text={text} />}
      </div>
    </main>
  );
}
