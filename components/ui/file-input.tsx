'use client';

import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import cameraCaptureIcon from '/public/camera-capture.svg';
import { Input } from './input';
import { Label } from './label';
import { isMobile } from 'react-device-detect';
import { Button, buttonVariants } from './button';
interface InputFileProps {
  onChange: (files: FileList | File[]) => void;
}

const desktopStyle =
  'flex justify-center w-full h-64 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none';

export function FileInput({ onChange }: InputFileProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const { files } = e.dataTransfer;

    if (files && files.length) {
      handleUpload(files);
    }
  };

  const handleUpload = (files: any) => {
    if (files && files.length) {
      setFile(files[0]);
      onChange(files);
    }
  };

  return (
    <div className='grid w-full max-w-2xl items-center gap-1.5'>
      {!isMobile ? (
        <Label htmlFor='icon-button-file' className={desktopStyle}>
          <span className='flex justify-center items-center flex-col'>
            Drag and drop image or <strong>browse</strong>
            {file && <p className='mt-2'>{file.name}</p>}
          </span>
        </Label>
      ) : (
        <Label
          htmlFor='icon-button-file'
          className={`${
            file
              ? buttonVariants({
                  variant: 'outline',
                })
              : buttonVariants({
                  variant: 'default',
                })
          }`}
        >
          {file ? 'Capture another photo' : 'Capture photo'}
        </Label>
      )}

      <Input
        onDragOver={handleDrag}
        onDrop={handleDrop}
        accept='image/*'
        id='icon-button-file'
        type='file'
        capture='environment'
        onChange={(e) => {
          if (e.target.files && e.target.files.length) {
            handleUpload(e.target.files);
          }
        }}
        className='hidden'
      />
    </div>
  );
}
