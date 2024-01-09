export type Chunk = {
  highlight: boolean;
  start: number;
  end: number;
  metric?: string;
  value?: number;
};

/**
 * Creates an array of chunk objects representing both higlightable and non highlightable pieces of text that match each search word.
 * @return Array of "chunks" (where a Chunk is { start:number, end:number, highlight:boolean })
 */
export const findAll = ({
  autoEscape,
  caseSensitive = false,
  findChunks = defaultFindChunks,
  sanitize,
  searchWords,
  textToHighlight,
}: {
  autoEscape?: boolean;
  caseSensitive?: boolean;
  findChunks?: typeof defaultFindChunks;
  sanitize?: typeof defaultSanitize;
  searchWords: Array<string>;
  textToHighlight: string;
}): Chunk[] =>
  fillInChunks({
    chunksToHighlight: combineChunks({
      chunks: findChunks({
        autoEscape,
        caseSensitive,
        sanitize,
        searchWords,
        textToHighlight,
      }),
    }),
    totalLength: textToHighlight ? textToHighlight.length : 0,
  });

/**
 * Takes an array of {start:number, end:number} objects and combines chunks that overlap into single chunks.
 * @return {start:number, end:number}[]
 */
export const combineChunks = ({ chunks }: { chunks: Chunk[] }) => {
  return chunks
    .sort((first, second) => first.start - second.start)
    .reduce((processedChunks: Chunk[], nextChunk) => {
      // First chunk just goes straight in the array...
      if (processedChunks.length === 0) {
        return [nextChunk];
      } else {
        // ... subsequent chunks get checked to see if they overlap...
        const prevChunk: Chunk | undefined = processedChunks.pop();
        if (prevChunk && nextChunk.start <= prevChunk.end) {
          // It may be the case that prevChunk completely surrounds nextChunk, so take the
          // largest of the end indices.
          const endIndex = Math.max(prevChunk.end, nextChunk.end);
          processedChunks.push({
            highlight: false,
            start: prevChunk.start,
            end: endIndex,
            metric: prevChunk.metric,
            value: prevChunk.value,
          });
        } else {
          if (prevChunk) {
            processedChunks.push(prevChunk);
          }
          processedChunks.push(nextChunk);
        }
        return processedChunks;
      }
    }, []);
};

const getMetricValue = (str: string): number => {
  // fractions
  if (str.includes('/')) {
    let split = str.split('/');
    let a = getMetricValue(split[0]);
    let b = getMetricValue(split[1]);
    // check for 0, NaN, Infinity, etc.
    if (a && b) return a / b;
  }

  // ranges
  if (str.includes('-')) {
    let split = str.split('-');
    let a = getMetricValue(split[0]);
    let b = getMetricValue(split[1]);
    // check for 0, NaN, Infinity, etc.
    if (a && b) return (a + b) / 2;
  }

  // spaces
  if (str.includes(' ')) {
    let split = str.split(' ');
    let a = getMetricValue(split[0]);
    let b = getMetricValue(split[1]);
    // check for 0, NaN, Infinity, etc.
    if (a && b) return a + b;
  }

  return parseInt(str, 10);
};

/**
 * Examine text for any matches.
 * If we find matches, add them to the returned array as a "chunk" object ({start:number, end:number}).
 * @return {start:number, end:number}[]
 */
const defaultFindChunks = ({
  autoEscape,
  caseSensitive,
  sanitize = defaultSanitize,
  searchWords,
  textToHighlight,
}: {
  autoEscape?: boolean;
  caseSensitive?: boolean;
  sanitize?: typeof defaultSanitize;
  searchWords: Array<string>;
  textToHighlight: string;
}): Chunk[] => {
  textToHighlight = sanitize(textToHighlight);

  return searchWords
    .filter((searchWord) => searchWord) // Remove empty words
    .reduce((chunks: Chunk[], searchWord) => {
      searchWord = sanitize(searchWord);

      if (autoEscape) {
        searchWord = escapeRegExpFn(searchWord);
      }

      const regex = new RegExp(
        `(\\d*(-*|/*)\\d+)*\\s*${searchWord}s*`,
        caseSensitive ? 'g' : 'gi'
      );

      let match;
      while ((match = regex.exec(textToHighlight))) {
        let start = match.index;
        let end = regex.lastIndex;

        let value;

        if (match[1]) {
          value = getMetricValue(match[1]);
        }

        console.log(match, value);

        // We do not return zero-length matches
        if (end > start) {
          chunks.push({
            highlight: false,
            start,
            end,
            metric: searchWord,
            value,
          });
        }

        // Prevent browsers like Firefox from getting stuck in an infinite loop
        // See http://www.regexguru.com/2008/04/watch-out-for-zero-length-matches/
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }

      return chunks;
    }, []);
};
// Allow the findChunks to be overridden in findAll,
// but for backwards compatibility we export as the old name
export { defaultFindChunks as findChunks };

/**
 * Given a set of chunks to highlight, create an additional set of chunks
 * to represent the bits of text between the highlighted text.
 * @param chunksToHighlight {start:number, end:number}[]
 * @param totalLength number
 * @return {start:number, end:number, highlight:boolean}[]
 */
export const fillInChunks = ({
  chunksToHighlight,
  totalLength,
}: {
  chunksToHighlight: Chunk[];
  totalLength: number;
}): Chunk[] => {
  const allChunks: Chunk[] = [];
  const append = (
    start: number,
    end: number,
    highlight: boolean,
    metric?: string,
    value?: number
  ) => {
    if (end - start > 0) {
      allChunks.push({
        start,
        end,
        highlight,
        metric,
        value,
      });
    }
  };

  if (chunksToHighlight.length === 0) {
    append(0, totalLength, false);
  } else {
    let lastIndex = 0;
    chunksToHighlight.forEach((chunk) => {
      append(lastIndex, chunk.start, false);
      append(chunk.start, chunk.end, true, chunk.metric, chunk.value);
      lastIndex = chunk.end;
    });
    append(lastIndex, totalLength, false);
  }
  return allChunks;
};

function defaultSanitize(string: string): string {
  return string;
}

function escapeRegExpFn(string: string): string {
  return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
