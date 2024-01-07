'use client';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface EditPhotoProps {
  source: string;
  onChange?: () => void;
}

export default function EditPhoto({ source }: EditPhotoProps) {
  const [crop, setCrop] = useState<Crop>();

  return (
    <div className='p-2'>
      <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
        <img src={source} />
      </ReactCrop>
      <Label className='text-sm text-muted-foreground'>
        Crop the photo so only text is visible.
      </Label>
    </div>
  );
}
