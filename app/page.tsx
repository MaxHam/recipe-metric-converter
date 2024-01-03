'use client';
import { FileInput } from '@/components/ui/file-input';
import Image from 'next/image';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import Tesseract from 'tesseract.js';
import EditPhoto from './EditPhoto';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function Home() {
  const [source, setSource] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const handleCapture = (files: FileList | File[]) => {
    if (files) {
      const file = files[0];
      const newUrl = URL.createObjectURL(file);
      setSource(newUrl);

      Tesseract.recognize(file, 'eng', { logger: (m) => console.log(m) }).then(
        ({ data: { text } }) => {
          setText(convertMetrics(text));
        }
      );
    }
  };

  const convertMetrics = (text: string) => {
    const keywords = ['teaspoon', 'tablespoon', 'cup', 'pound', 'ounce'];
    let result = text;

    for (const keyword of keywords) {
      if (result.includes(keyword)) {
        result = result.replace(keyword, keyword.toLocaleUpperCase());
      }
    }

    return result;
  };

  return (
    <main className='flex min-h-screen w-xl flex-col items-center justify-between p-5'>
      {!source && (
        <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
          Take a photo of your recipe to get started!
        </h3>
      )}

      {source && <EditPhoto source={source} />}
      <div className='w-full grid grid-flow-row gap-2'>
        <FileInput onChange={handleCapture} />
        {source && (
          <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogTrigger className='w-full'>
              <Button className='w-full'>Convert metrics</Button>
              <DialogContent>
                <p className='text-2xl whitespace-pre-line'>{`${text}`}</p>
              </DialogContent>
            </DialogTrigger>
          </Dialog>
        )}
      </div>
      {/* {text && (
        <div className='w-96 h-96 overflow-auto'>
          <p className='text-2xl whitespace-pre-line'>{`${text}`}</p>
        </div>
      )} */}
    </main>
  );
}
