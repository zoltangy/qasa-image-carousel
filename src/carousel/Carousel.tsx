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
} & typeof defaultProps;

const defaultProps = {
  showDots: true,
  showArrows: true,
  preloadImages: true,
};

export const Carousel = (props: CarouselProps) => {
  const { data, showDots, showArrows, preloadImages } = props;
  const dataWithOffset: dataType = [data[data.length - 1], ...data, data[0]];
  const classes = useStyles();
  const [pos, setPos] = useState(1);
  const prevPosRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null!);
  const [width, setWidth] = useState(0);
  const swipehandlers = useSwipeable({
    onSwipedLeft: () => goForward(),
    onSwipedRight: () => goBackward(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const firstRender = useRef(true);
  const [interactionEnabled, setInteractionEnabled] = useState(true);

  // get previous position, to know where the last transition came from
  useEffect(() => {
    prevPosRef.current = pos;
  }, [pos]);
  const prevPos = prevPosRef.current;

  // move control functions
  const goForward = useCallback(() => {
    if (!interactionEnabled) return;
    firstRender.current = false;
    setPos((p) => p + 1);
    setInteractionEnabled(false);
  }, [interactionEnabled]);

  const goBackward = useCallback(() => {
    if (!interactionEnabled) return;
    firstRender.current = false;
    setPos((p) => p - 1);
    setInteractionEnabled(false);
  }, [interactionEnabled]);

  const goTo = (target: number) => {
    if (!interactionEnabled) return;
    firstRender.current = false;
    setPos(target);
    setInteractionEnabled(false);
  };

  // preload images
  useEffect(() => {
    if (preloadImages) {
      data.forEach((item) => {
        const imgageToLoad = new Image();
        imgageToLoad.src = item.url;
        imgageToLoad.onload = () => {
          setImagesLoaded((x) => x + 1);
        };
      });
    } else {
      setImagesLoaded(data.length);
    }
  }, [preloadImages, data]);

  // arrow navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goBackward();
      } else if (event.key === 'ArrowRight') {
        goForward();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goBackward, goForward]);

  // get initial width and update on resize
  const getWidth = (el: HTMLDivElement) => {
    if (el !== null) {
      setWidth(el.getBoundingClientRect().width);
    }
  };

  const captureWidthOnResize = useCallback(() => getWidth(wrapperRef.current), []);
  const initialRefForWidth = useCallback((el) => getWidth(el), []);

  useEffect(() => {
    window.addEventListener('resize', captureWidthOnResize);
    return () => {
      window.removeEventListener('resize', captureWidthOnResize);
    };
  }, [captureWidthOnResize]);

  // handle 'instant jump' when wrapping around after transition finished, also re-enable controls
  const handleTransitionEnd = () => {
    if (pos === 0) setPos(data.length);
    if (pos === data.length + 1) setPos(1);
    setInteractionEnabled(true);
  };

  // when wrapping around and on the first load, slide instantly (without transition)
  const shouldMoveWithoutTransition =
    (pos === 1 && prevPos === data.length + 1) ||
    (pos === data.length && prevPos === 0) ||
    firstRender.current;

  // active dot position needs to account for wrapping around
  let indicatorPosition = pos - 1;
  if (pos === 0) indicatorPosition = data.length - 1;
  if (pos === data.length + 1) indicatorPosition = 0;

  // loading spinner
  if (imagesLoaded !== data.length) {
    return (
      <div className={classes.loaderDiv}>
        <CircularProgress className={classes.loader} />
      </div>
    );
  }

  return (
    <div {...swipehandlers}>
      <div className={classes.wrapper} ref={initialRefForWidth}>
        <div
          data-testid="carousel"
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
        {showDots && <CarouselIndicator active={indicatorPosition} numItems={data.length} goTo={goTo} />}
        {showArrows && (
          <>
            <CarouselArrow
              direction="backward"
              onClick={() => goBackward()}
              onKeyDown={(event) => {
                if (event.key === ' ' || event.key === 'Enter' || event.key === 'Spacebar') goBackward();
              }}
              tabIndex={0}
            />
            <CarouselArrow
              direction="forward"
              onClick={() => goForward()}
              onKeyDown={(event) => {
                if (event.key === ' ' || event.key === 'Enter' || event.key === 'Spacebar') goForward();
              }}
              tabIndex={0}
            />
          </>
        )}
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

Carousel.defaultProps = defaultProps;
