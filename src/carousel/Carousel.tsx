import React, { useState, useRef, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useSwipeable } from 'react-swipeable';
import CircularProgress from '@material-ui/core/CircularProgress';
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
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const firstRender = useRef(true);

  useEffect(() => {
    data.forEach((item) => {
      const imgageToLoad = new Image();
      imgageToLoad.src = item.url;
      imgageToLoad.onload = () => {
        setImagesLoaded((x) => x + 1);
      };
    });
  }, [data]);

  useEffect(() => {
    prevPosRef.current = pos;
  }, [pos]);
  const prevPos = prevPosRef.current;

  const captureWidthOnResize = () => {
    if (wrapperRef.current) {
      setWidth(wrapperRef.current.offsetWidth);
    }
  };

  const initialRefForWidth = useCallback((node) => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', captureWidthOnResize);
    return () => {
      window.removeEventListener('resize', captureWidthOnResize);
    };
  }, []);

  const handleTransitionEnd = () => {
    if (pos === 0) setPos(data.length);
    if (pos === data.length + 1) setPos(1);
  };

  const goForward = () => {
    firstRender.current = false;
    setPos((p) => p + 1);
  };
  const goBackward = () => {
    firstRender.current = false;
    setPos((p) => p - 1);
  };
  const goTo = (target: number) => {
    firstRender.current = false;
    setPos(target);
  };

  const shouldMoveWithoutTransition =
    (pos === 1 && prevPos === data.length + 1) ||
    (pos === data.length && prevPos === 0) ||
    firstRender.current;

  let indicatorPosition = pos - 1;
  if (pos === 0) indicatorPosition = data.length - 1;
  if (pos === data.length + 1) indicatorPosition = 0;

  if (imagesLoaded !== data.length) {
    return (
      <div className={classes.loaderDiv}>
        <CircularProgress className={classes.loader} />
      </div>
    );
  }

  return (
    <div {...handlers}>
      <div className={classes.wrapper} ref={initialRefForWidth}>
        <div
          ref={wrapperRef}
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
  loaderDiv: {
    textAlign: 'center',
  },
  loader: {
    color: '#dedede',
  },
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
