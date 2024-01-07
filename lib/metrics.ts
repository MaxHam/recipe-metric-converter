export const keywords = [
  'teaspoon',
  'tablespoon',
  'cup',
  'pound',
  'ounce',
  'inch',
];

export const imperialToMetricSystem: {
  [key: string]: { metric: string; fn: (value: number) => number };
} = {
  teaspoon: { metric: 'ml', fn: (value: number) => value * 5 },
  tablespoon: { metric: 'ml', fn: (value: number) => value * 15 },
  cup: { metric: 'ml', fn: (value: number) => value * 240 },
  pound: { metric: 'g', fn: (value: number) => value * 453.592 },
  ounce: { metric: 'g', fn: (value: number) => value * 28.3495 },
  inch: { metric: 'cm', fn: (value: number) => value * 2.54 },
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
