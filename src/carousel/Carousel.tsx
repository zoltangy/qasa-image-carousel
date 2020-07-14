import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useSwipeable } from 'react-swipeable';
//--
import { CarouselImage } from './CarouselImage';
import { CarouselIndicator } from './CarouselIndicator';
import { CarouselArrow } from './CarouselArrow';

type dataType = { url: string }[];

export type CarouselProps = {
  data: dataType;
};

export const Carousel: React.FC<CarouselProps> = ({ data }) => {
  const dataWithOffset: dataType = [data[data.length - 1], ...data, data[0]];
  const classes = useStyles();
  const [pos, setPos] = useState(1);
  const prevPosRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null!);
  const [width, setWidth] = useState(0);
  const handlers = useSwipeable({
    onSwipedLeft: () => goForward(),
    onSwipedRight: () => goBackward(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  useEffect(() => {
    prevPosRef.current = pos;
  });
  const prevPos = prevPosRef.current;

  const captureCurrentWidth = () => {
    if (wrapperRef.current) {
      setWidth(wrapperRef.current.offsetWidth);
    }
  };

  useLayoutEffect(() => {
    captureCurrentWidth();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', captureCurrentWidth);
    return function cleanup() {
      window.removeEventListener('resize', captureCurrentWidth);
    };
  }, []);

  const handleTransitionEnd = () => {
    if (pos === 0) setPos(data.length);
    if (pos === data.length + 1) setPos(1);
  };

  const goForward = () => setPos((p) => p + 1);
  const goBackward = () => setPos((p) => p - 1);
  const goTo = (target: number) => setPos(target);

  const shouldMoveWithoutTransition =
    (pos === 1 && prevPos === data.length + 1) || (pos === data.length && prevPos === 0);

  let indicatorPosition = pos - 1;
  if (pos === 0) indicatorPosition = data.length - 1;
  if (pos === data.length + 1) indicatorPosition = 0;

  return (
    <div {...handlers}>
      <div className={classes.wrapper} ref={wrapperRef}>
        <div
          className={
            shouldMoveWithoutTransition ? classes.carousel : `${classes.carousel} ${classes.withTransition}`
          }
          style={{ left: pos * width * -1 }}
          onTransitionEnd={handleTransitionEnd}
        >
          {dataWithOffset.map((item, index) => (
            <CarouselImage key={item.url + index} src={item.url} index={index} />
          ))}
        </div>
        <CarouselIndicator active={indicatorPosition} numItems={data.length} goTo={goTo} />
        <CarouselArrow direction="backward" onClick={() => goBackward()} />
        <CarouselArrow direction="forward" onClick={() => goForward()} />
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  carousel: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  withTransition: {
    transition: 'all 1s ease',
  },
});
