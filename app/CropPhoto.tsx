'use client';
import { Label } from '@/components/ui/label';
import { debounce } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const TO_RADIANS = Math.PI / 180;
interface CropPhotoProps {
  source: string;
  onChange: (output: string) => void;
}

export default function CropPhoto({ source, onChange }: CropPhotoProps) {
  const [image, setImage] = useState<any>();
  const [crop, setCrop] = useState<Crop>();

  const cropImage = (
    crop: Crop | undefined,
    image: any,
    scale: number = 1,
    rotation: number = 0
  ): string | undefined => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the image back down if you want to download/upload and be
    // true to the images natural size.
    const pixelRatio = window.devicePixelRatio;
    // const pixelRatio = 1

    if (!crop) return;
    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    const rotateRads = rotation * TO_RADIANS;
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY);
    // 3) Rotate around the origin
    ctx.rotate(rotateRads);
    // 2) Scale the image
    ctx.scale(scale, scale);
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    ctx.restore();

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

  useEffect(() => {
    // reset crop when source changes
    setCrop(undefined);
  }, [source]);

  return (
    <div className='flex flex-col justify-start pb-4 w-full max-h-full'>
      <ReactCrop
        crop={crop}
        onChange={(c) => setCrop(c)}
        className='border-2'
        minWidth={20}
        minHeight={20}
        style={{
          maxHeight: !isMobile ? '40dvh' : '',
          maxWidth: !isMobile ? '' : '100%',
          overflow: 'hidden',
          width: 'fit-content',
        }}
      >
        <img src={source} onLoad={(e) => setImage(e.target)} />
      </ReactCrop>

      <Label className='text-sm text-muted-foreground pt-1'>
        Crop out bullet point markers and other non-text elements for optimal
        results.
      </Label>
    </div>
  );
}
