'use client';
import { HighlightedMetric } from '@/components/HighlightedMetric';
import { buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Chunk, findAll } from '@/lib/chunks';
import { keywords } from '@/lib/metrics';
import parse, { HTMLReactParserOptions } from 'html-react-parser';
import { useEffect, useState } from 'react';

interface ConvertMetricsProps {
  text: string;
}

/**
 *
 * TODO: Highlight metrics in text and convert them correctly
 */

export default function ConvertMetrics({ text }: ConvertMetricsProps) {
  const [formattedHTML, setFormattedHTML] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [isConverted, setIsConverted] = useState<boolean>(false);

  useEffect(() => {
    const chunks: { end: any; highlight: any; start: any }[] =
      findMetrics(text);

    const formattedChunks = chunks.map((chunk: Chunk, idx: number) => {
      const { end, highlight, start, metric, value } = chunk;
      const currText = text.substr(start, end - start);

      if (highlight) {
        if (!isConverted)
          return `<mark key='${metric}-${value}-${start}-${end}' class='bg-orange-200 pr-1 pl-1'>${currText}</mark>`;

        return `<mark key='${metric}-${value}-${start}-${end}' id='highlighted-metric' value=${value} metric=${metric} />`;
      } else {
        return currText;
      }
    });

    const formattedHTML = formattedChunks;

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

  const parserOptions: HTMLReactParserOptions = {
    replace(domNode) {
      if (
        // @ts-ignore
        domNode.attribs &&
        // @ts-ignore
        domNode.attribs.id === 'highlighted-metric'
      ) {
        return (
          <HighlightedMetric
            // @ts-ignore
            key={`${domNode.attribs.key}`}
            // @ts-ignore
            value={domNode.attribs.value}
            // @ts-ignore
            metric={domNode.attribs.metric}
          />
        );
      }
    },
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
        <DialogHeader>
          <div className='flex flex-row justify-between pt-6'>
            <h4 className='pr-2 scroll-m-20 text-xl font-semibold tracking-tight'>
              {!isConverted ? (
                <mark className='bg-orange-200 pr-1 pl-1'>Original</mark>
              ) : (
                <mark className='bg-yellow-200 pr-1 pl-1'>Converted</mark>
              )}{' '}
              Recipe
            </h4>
            <Switch
              id='conversion-mode'
              checked={isConverted}
              disabled={formattedHTML.length < 1}
              onCheckedChange={handleSwitchChange}
            />
          </div>

          <Separator className='mb-2' />
        </DialogHeader>

        <p className='whitespace-pre-line block'>
          {formattedHTML.length < 1
            ? 'Converting ...'
            : formattedHTML.map((piece) => parse(`${piece}`, parserOptions))}
        </p>
      </DialogContent>
    </Dialog>
  );
}
