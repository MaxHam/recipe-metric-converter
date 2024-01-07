/**
 * TODO: Cover ranges like 1-2 cups
 * TODO: Cover fractions like 1/2 cup
 * TODO: Try to mitigate weird text detections for dashes "-" -> "e" after OCR
 *
 */

export const keywords = [
  'teaspoon',
  'tablespoon',
  'cup',
  'pound',
  'ounce',
  'inch',
];

export const imperialToMetricSystem: {
  [key: string]: {
    metric: string;
    fn: (value: number) => number;
    color: string;
  };
} = {
  teaspoon: { metric: 'ml', fn: (value: number) => value * 5, color: 'red' },
  tablespoon: {
    metric: 'ml',
    fn: (value: number) => value * 15,
    color: 'orange',
  },
  cup: { metric: 'ml', fn: (value: number) => value * 240, color: 'yellow' },
  pound: {
    metric: 'g',
    fn: (value: number) => value * 453.592,
    color: 'green',
  },
  ounce: { metric: 'g', fn: (value: number) => value * 28.3495, color: 'blue' },
  inch: { metric: 'cm', fn: (value: number) => value * 2.54, color: 'purple' },
};

export const convert = (value: number | undefined, from: string): string => {
  if (!value) {
    return from || '';
  }

  if (!imperialToMetricSystem[from || '']) {
    return `${value} ${from}${value > 1 ? 's' : ''}`;
  }

  const { metric, fn } = imperialToMetricSystem[from];
  const convertedValue = fn(value);
  return `${Math.round(convertedValue)} ${metric}`;
};
