'use client';
import { MetricDropdown } from '@/components/metric-dropdown';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { Chunk, findAll } from '@/lib/chunks';
import { convert, imperialToMetricSystem, keywords } from '@/lib/metrics';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface ConvertMetricsProps {
  text: string;
}

/**
 *
 * TODO: Highlight metrics in text and convert them correctly
 */

export default function ConvertMetrics({ text }: ConvertMetricsProps) {
  const [formattedHTML, setFormattedHTML] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [isConverted, setIsConverted] = useState<boolean>(true);

  useEffect(() => {
    const chunks: { end: any; highlight: any; start: any }[] =
      findMetrics(text);

    const formattedChunks = chunks.map((chunk: Chunk, idx: number) => {
      const { end, highlight, start, metric, value } = chunk;
      const currText = text.substr(start, end - start);

      if (highlight) {
        if (!isConverted) return `<mark>${currText}</mark>`;

        const convertedMetric = convert(value, metric || '');
        return `<mark>${convertedMetric}</mark>`;
      } else {
        return currText;
      }
    });

    const formattedHTML = formattedChunks.join('');

    setFormattedHTML(formattedHTML);
  }, [text, isConverted]);

  const handleSwitchChange = () => {
    setIsConverted(!isConverted);
  };

  const findMetrics = (text: string) => {
    const chunks = findAll({
      searchWords: keywords,
      textToHighlight: text,
      caseSensitive: false,
    });

    return chunks;
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger
        className={`${buttonVariants({
          variant: 'default',
        })} w-full`}
      >
        Convert metrics
      </DialogTrigger>
      <DialogContent className='h-full max-h-screen'>
        <p className='whitespace-pre-line'>{parse(`${formattedHTML}`)}</p>
        <DialogFooter className='flex-col justify-end'>
          <Separator />
          <div className='flex flex-row justify-center items-center mt-2'>
            <Switch
              id='conversion-mode'
              checked={isConverted}
              onCheckedChange={handleSwitchChange}
              className='mr-2'
            />
            <Label htmlFor='conversion-mode'>Conversion</Label>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
