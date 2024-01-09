'use client';
import { buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Chunk, findAll } from '@/lib/chunks';
import { convert, keywords } from '@/lib/metrics';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';

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
    const text = `
    2 cups (240 g) all-purpose flour
    
    2 cups (396 g) sugar
    
    3/4 cup (63 g) unsweetened cocoa powder
    
    2-3 teaspoons (8 g) baking powder
    
    1 1/2 teaspoons (9 g) baking soda
    
    1teaspoon (2.8 g) kosher salt
    
    1 teaspoon (2.3 g) espresso powder, homemade or store-bought
    1 cup (227 g) milk, or buttermilk, almond, or coconut milk
    
    1/2 cup (99 g) vegetable oil, or canola oil, or melted coconut oil
    2 large (100 g) eggs
    
    2 teaspoons (9.4 g) vanilla extract
    
    1 cup (227. g) boiling water
    
    Chocolate Buttercream Frosting Recipe`;
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
      <DialogContent>
        <p className='whitespace-pre-line'>{parse(`${formattedHTML}`)}</p>
        <DialogFooter className='flex-col flex'>
          <div className='flex justify-flex-start items-center'>
            <Switch
              id='conversion-mode'
              checked={isConverted}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor='conversion-mode' className='pl-2'>
              {isConverted ? 'Converted' : 'Original'}
            </Label>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
