import { convert } from '@/lib/metrics';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from './ui/select';
import { useState } from 'react';

interface HighlightedMetricProps {
  metric: string;
  value: number;
}

export const HighlightedMetric = ({
  metric,
  value,
}: HighlightedMetricProps) => {
  const [convertedMetric, setConvertedMetric] = useState<string>(
    convert(value, metric, 'g')
  );

  const handleChange = (to: string) => {
    setConvertedMetric(convert(value, metric, to));
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className='bg-yellow-200 pr-1 pl-1'>
        <SelectValue placeholder={convertedMetric}>
          {convertedMetric}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='g'>g</SelectItem>
        <SelectItem value='ml'>ml</SelectItem>
      </SelectContent>
    </Select>
  );
};
