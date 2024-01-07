'use client';
import { Label } from '@/components/ui/label';
import { debounce } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface EditPhotoProps {
  source: string;
  onChange: (output: string) => void;
}

export default function EditPhoto({ source, onChange }: EditPhotoProps) {
  const [image, setImage] = useState<any>();
  const [crop, setCrop] = useState<Crop>();

  const cropImage = (
    crop: Crop | undefined,
    image: any
  ): string | undefined => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    if (!crop || !image) return;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    if (!ctx) return;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // Converting to base64
    const base64Image = canvas.toDataURL('image/jpeg');
    return base64Image;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateOutput = useCallback(
    debounce((crop: Crop | undefined, image: any) => {
      const output = cropImage(crop, image);
      if (output) {
        onChange(output);
      }
    }, 500),
    [onChange]
  );

  useEffect(() => {
    if (!crop || !image) return;
    updateOutput(crop, image);
  }, [crop, image, updateOutput]);

  return (
    <div className='p-2'>
      <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
        <img src={source} onLoad={(e) => setImage(e.target)} />
      </ReactCrop>
      <Label className='text-sm text-muted-foreground'>
        Crop the photo so only text is visible.
      </Label>
    </div>
  );
}
