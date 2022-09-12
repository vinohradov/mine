import React, { useState } from 'react';

enum Mask {
  Transparent,
  Fill,
}

function createField(sizeX: number, sizeY: number, bombs: number): number[] {
  const field: number[] = new Array(sizeX * sizeY).fill(0);
  const maxBombsX = bombs > sizeX ? sizeX : bombs;
  const maxBombsY = bombs > sizeY ? sizeY : bombs;

  const inc = (x: number, y: number) => {
    if (x >= 0 && x < sizeX && y >= 0 && y < sizeY) {
      if (field[y * sizeX + x] === Bomb) return;

      field[y * sizeX + x] += 1;
    }
  };

  for (let i = 0; i < bombs;) {
    const x = Math.floor(Math.random() * maxBombsX);
    const y = Math.floor(Math.random() * maxBombsY);

    if (field[y * sizeX + x] === Bomb) {
      continue;
    }

    field[y * sizeX + x] = Bomb;

    i += 1;

    inc(x + 1, y);
    inc(x - 1, y);
    inc(x, y + 1);
    inc(x, y - 1);
    inc(x + 1, y - 1);
    inc(x - 1, y - 1);
    inc(x + 1, y + 1);
    inc(x - 1, y + 1);
  }

  return field;
}

const Bomb = -1;

interface PropsTypes {
  sizeX: number;
  sizeY: number;
  bombs: number,
}

export default function Field({ sizeX, sizeY, bombs }: PropsTypes) {
  const dimension = new Array(sizeY).fill(new Array(sizeX).fill(0));

  const [isLoose, setIsLoose] = useState(false);
  const [field] = useState<number[]>(() => createField(sizeX, sizeY, bombs));
  const [mask, setMask] = useState<Mask[]>(() => new Array(sizeX * sizeY).fill(Mask.Fill));

  const isWin = React.useMemo(
    () => !field.some(
      (f, i) => f === Bomb && mask[i] !== Mask.Transparent,
    ),
    [field, mask],
  );

  const handleClick = (x:number, y:number):void => {
    if (isWin || isLoose) return;

    if (mask[y * sizeX + x] === Mask.Transparent) return;

    const clearing: any = [];

    const clear = (x: number, y: number) => {
      if (x >= 0 && x < sizeX && y >= 0 && y < sizeY) {
        if (mask[y * sizeX + x] === Mask.Transparent) return;

        clearing.push([x, y]);
      }
    };

    clear(x, y);

    while (clearing.length) {
      const [x, y] = clearing.pop();
      mask[y * sizeX + x] = Mask.Transparent;

      if (field[y * sizeX + x] !== 0) continue;

      clear(x + 1, y);
      clear(x - 1, y);
      clear(x, y + 1);
      clear(x, y - 1);
    }

    if (field[y * sizeX + x] === Bomb) {
      mask.forEach((_, i) => mask[i] = Mask.Transparent);

      setIsLoose(true);
    }

    setMask((prev: any) => [...prev]);
  };

  const renderFieldContent = (x: number, y: number):any => {
    const fieldIndex = y * sizeX + x;

    switch (true) {
      case mask[fieldIndex] !== Mask.Transparent:
        return null;
      case field[fieldIndex] === Bomb:
        return 'X';
      default:
        return field[fieldIndex];
    }
  };

  return (
    <div>
      {dimension.map((dimensionX: [], y: number) => (
        <div key={y} className="row">
          {dimensionX.map((_, x:number) => (
            <div
              key={`${y + x}`}
              className="field"
              style={{
                backgroundColor: isLoose ? '#fca7a7' : isWin ? '#f6f6b2' : '#a2dba2',
              }}
              onClick={() => handleClick(x, y)}
            >
              {renderFieldContent(x, y)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
