/**
 * TODO: Cover cases like 1 1/2 tsp
 * TODO: add saving to local storage
 * TODO: https://medium.com/designly/creating-an-install-to-home-screen-prompt-in-a-next-js-progressive-web-app-588a3e7a6747
 * TODO: add reverse conversion
 */

export const keywords = [
  'teaspoon',
  'tsp',
  'tablespoon',
  'tbsp',
  'cup',
  'pound',
  'lb',
  'ounce',
  'oz',
  'inch',
  'in',
];

export const imperialToMetricSystem: {
  [key: string]: {
    [key: string]: {
      fn: (value: number) => number;
      color: string;
    };
  };
} = {
  teaspoon: {
    ml: { fn: (value: number) => value * 4.92892, color: 'red' },
    g: { fn: (value: number) => value * 5.69, color: 'red' },
  },
  tsp: {
    ml: { fn: (value: number) => value * 4.92892, color: 'red' },
    g: { fn: (value: number) => value * 5.69, color: 'red' },
  },
  tablespoon: {
    ml: {
      fn: (value: number) => value * 14.7868,
      color: 'orange',
    },
    g: {
      fn: (value: number) => value * 14.175,
      color: 'orange',
    },
  },
  tbsp: {
    ml: {
      fn: (value: number) => value * 14.7868,
      color: 'orange',
    },
    g: {
      fn: (value: number) => value * 14.175,
      color: 'orange',
    },
  },
  cup: {
    ml: { fn: (value: number) => value * 236.588, color: 'yellow' },
    g: { fn: (value: number) => value * 240, color: 'yellow' },
  },
  pound: {
    g: {
      fn: (value: number) => value * 453.592,
      color: 'green',
    },
  },
  lb: { g: { fn: (value: number) => value * 453.592, color: 'green' } },
  ounce: { g: { fn: (value: number) => value * 28.3495, color: 'blue' } },
  oz: { g: { fn: (value: number) => value * 28.3495, color: 'blue' } },
  inch: { g: { fn: (value: number) => value * 2.54, color: 'purple' } },
  in: { g: { fn: (value: number) => value * 2.54, color: 'purple' } },
};

export const convert = (
  value: number | undefined,
  from: string,
  to: string
): string => {
  if (!value) {
    return from || '';
  }

  if (!imperialToMetricSystem[from || ''][to || '']) {
    return `${value} ${from}${value > 1 ? 's' : ''}`;
  }

  const { fn } = imperialToMetricSystem[from][to];
  const convertedValue = fn(value);
  return `${Math.round(convertedValue)} ${to}`;
};
