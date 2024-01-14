'use client';

import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDropzone } from 'react-dropzone';
import { buttonVariants } from './button';
import { Input } from './input';
import { Label } from './label';
import Image from 'next/image';

interface InputFileProps {
  onChange: (files: FileList | File[]) => void;
}

const desktopStyle =
  'p-2 bg-white hover:bg-gray-100 flex justify-center items-center w-full h-64 px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none';

export function FileInput({ onChange }: InputFileProps) {
  const [isSSR, setIsSSR] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length) {
        handleUpload(acceptedFiles);
      }
    },
    accept: { 'image/png': [], 'image/jpeg': [], 'image/jpg': [] },
    maxFiles: 1,
    noClick: isMobile, // https://stackoverflow.com/questions/54019106/react-allow-user-to-add-file-from-gallery-or-camera#:~:text=The%20right%20answer%20is%20that,supported%20by%20all%20mobile%20devices.
  });

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

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <div className='w-full items-center pb-2' {...getRootProps()}>
      {!isMobile ? (
        <Label htmlFor='icon-button-file' className={desktopStyle}>
          <span className='flex justify-center items-center flex-col p-2'>
            Drag and drop a recipe image or <strong>browse here</strong>
            {file && <p className='mt-2'>{file.name}</p>}
          </span>
          {file && (
            <div className='relative w-32 h-32'>
              <Image
                alt='Recipe photo preview'
                src={file ? URL.createObjectURL(file) : ''}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
        </Label>
      ) : (
        <Label
          htmlFor='icon-button-file'
          className={`w-full ${
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
        id='icon-button-file'
        onChange={(e) => {
          if (e.target.files && e.target.files.length) {
            handleUpload(e.target.files);
          }
        }}
        className='hidden'
        {...getInputProps()}
      />
    </div>
  );
}
