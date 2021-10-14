import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  minValue?: number | undefined;
  maxValue?: number | undefined;
  onChange: Function;
}

const MultiRangeSlider: FC<MultiRangeSliderProps> = ({
  min,
  max,
  minValue,
  maxValue,
  onChange,
}) => {
  if (!minValue) {
    minValue = min;
  }
  if (!maxValue) {
    maxValue = max;
  }
  const [minVal, setMinVal] = useState(minValue);
  const [maxVal, setMaxVal] = useState(maxValue);
  const minValRef = useRef(minValue);
  const maxValRef = useRef(maxValue);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );
  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minVal]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxVal]);

  // Get min and max values when their state changes

  return (
    <>
      <div className="slider relative w-full">
        <div className="slider__track absolute h-px w-full bg-gray-300"></div>
        <div
          ref={range}
          className="slider__range absolute bg-gray-500 h-px"
        ></div>
        <div className="slider__left-value absolute left-2">{minVal}</div>
        <div className="slider__right-value absolute -right-2">{maxVal}</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
          onChange({ min: value, max: maxVal });
        }}
        className="thumb thumb--left appearance-none h-0 w-full relative bottom-5 z-40 pointer-events-none"
        style={{ zIndex: minVal > max - 100 && 5 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
          onChange({ min: minVal, max: value });
        }}
        className="thumb thumb--right appearance-none h-0 w-full relative bottom-11 z-40 pointer-events-none"
      />
    </>
  );
};

export default MultiRangeSlider;
