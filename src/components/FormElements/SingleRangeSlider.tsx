import * as React from "react";

function SingleRangeSlider({ min, max, value, onChange }) {
  if (!value) {
    value = max;
  }
  const [val, setVal] = React.useState(value);
  const range = React.useRef<HTMLDivElement>(null);

  const getPercent = React.useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  React.useEffect(() => {
    const minPercent = getPercent(val);

    if (range.current) {
      range.current.style.right = `${100 - minPercent}%`;
      range.current.style.width = `${minPercent}%`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val]);

  return (
    <>
      <div className="slider relative w-full">
        <div className="slider__track absolute h-px w-full bg-gray-300"></div>
        <div
          ref={range}
          className="slider__range absolute bg-gray-500 h-px"
        ></div>
        <div className="slider__left-value absolute left-2">{val}</div>
      </div>
      <input
        type="range"
        name=""
        min={0}
        max={100}
        value={val}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const value = Number(event.target.value);
          setVal(value);
          onChange(value);
        }}
        id=""
        className="thumb thumb--left appearance-none h-0 w-full relative bottom-5 z-40 pointer-events-none"
      />
    </>
  );
}

export default SingleRangeSlider;
