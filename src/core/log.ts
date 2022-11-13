import * as Box from 'cli-box';
let _debug = undefined;

export const debug = async (...input: any[]) => {
  // if (!_debug) _debug = (await import('debug'))('orm');
  // _debug(...(input.length ? input : ['']));

  if (process.env.DEBUG === 'orm') console.log(...input);
};

export const formatObject = (input: { [key: string]: any }) => {
  const keys = Object.keys(input);

  const maxLength = Math.max(...keys.map((k) => k.length));
  const lines = keys.map((key) => {
    return `­${key.padStart(maxLength, ' ')}: ${input[key]}`;
  });
  const cols = process.stdout.columns;

  const box = new Box(
    {
      w: cols - 1,
      h: lines.length,
      stringify: false,
    },
    { vAlign: 'center', stretch: false, hAlign: 'left', text: lines.join('\n') },
  );

  return box.stringify() + '\n';
};
