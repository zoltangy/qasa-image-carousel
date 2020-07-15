import React, { useState, useEffect, useReducer } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useSwipeable } from 'react-swipeable';
import CircularProgress from '@material-ui/core/CircularProgress';
//--
import { CarouselImage } from './CarouselImage';
import { CarouselIndicator } from './CarouselIndicator';
import { CarouselArrow } from './CarouselArrow';
import { useWidth } from '../hooks/useWidth';

type dataType = { url: string }[];

export type CarouselProps = {
  data: dataType;
} & typeof defaultProps;

const defaultProps = {
  showDots: true,
  showArrows: true,
  preloadImages: true,
};

export const FORWARD = 'FORWARD';
export const BACKWARD = 'BACKWARD';
export const JUMP = 'JUMP';
export const TRANSITION_END = 'TRANSITION_END';

type forward = { type: typeof FORWARD };
type backward = { type: typeof BACKWARD };
type jump = { type: typeof JUMP; payload: number };
type transitionEnd = { type: typeof TRANSITION_END };

export type Action = forward | backward | jump | transitionEnd;

type CarouselState = {
  pos: number;
  indicatorPos: number;
  shouldMoveWithoutTransition: boolean;
  interactionEnabled: boolean;
};

const initialState = {
  pos: 1,
  indicatorPos: 0,
  shouldMoveWithoutTransition: true,
  interactionEnabled: true,
};

export const Carousel = (props: CarouselProps) => {
  const { data, showDots, showArrows, preloadImages } = props;
  const dataWithOffset: dataType = [data[data.length - 1], ...data, data[0]];
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [width, widthRef] = useWidth();
  const swipehandlers = useSwipeable({
    onSwipedLeft: () => dispatch({ type: FORWARD }),
    onSwipedRight: () => dispatch({ type: BACKWARD }),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });
  const [imagesLoaded, setImagesLoaded] = useState(0);

  function reducer(state: CarouselState, action: Action): CarouselState {
    switch (action.type) {
      case FORWARD:
        if (!state.interactionEnabled) return state;
        return {
          ...state,
          pos: state.pos + 1,
          indicatorPos: state.pos === data.length ? 0 : state.pos,
          interactionEnabled: false,
          shouldMoveWithoutTransition: false,
        };
      case BACKWARD:
        if (!state.interactionEnabled) return state;
        return {
          ...state,
          pos: state.pos - 1,
          indicatorPos: state.pos === 1 ? data.length - 1 : state.pos - 2,
          interactionEnabled: false,
          shouldMoveWithoutTransition: false,
        };
      case JUMP:
        return {
          ...state,
          pos: action.payload,
          indicatorPos: action.payload - 1,
          interactionEnabled: false,
          shouldMoveWithoutTransition: false,
        };
      case TRANSITION_END:
        let pos = state.pos;
        let shouldMoveWithoutTransition = false;
        if (state.pos === 0) {
          pos = data.length;
          shouldMoveWithoutTransition = true;
        }
        if (state.pos === data.length + 1) {
          pos = 1;
          shouldMoveWithoutTransition = true;
        }
        return {
          ...state,
          pos,
          interactionEnabled: true,
          shouldMoveWithoutTransition,
        };
      default:
        return state;
    }
  }

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
        event.preventDefault();
        dispatch({ type: BACKWARD });
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        dispatch({ type: FORWARD });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

  // loading spinner
  if (imagesLoaded !== data.length) {
    return (
      <div className={classes.loaderDiv}>
        <CircularProgress className={classes.loader} />
      </div>
    );
  }

  return (
    <div {...swipehandlers} className={classes.wrapper}>
      <div
        data-testid="carousel"
        ref={widthRef}
        className={
          state.shouldMoveWithoutTransition
            ? classes.carousel
            : `${classes.carousel} ${classes.withTransition}`
        }
        style={{ left: state.pos * width * -1 }}
        onTransitionEnd={() => dispatch({ type: TRANSITION_END })}
      >
        {dataWithOffset.map((item, index) => (
          <CarouselImage key={item.url + index} src={item.url} index={index} />
        ))}
      </div>
      {showDots && (
        <CarouselIndicator active={state.indicatorPos} numItems={data.length} dispatch={dispatch} />
      )}
      {showArrows && (
        <>
          <CarouselArrow
            direction="backward"
            onClick={() => dispatch({ type: BACKWARD })}
            onKeyDown={(event) => {
              if (event.key === ' ' || event.key === 'Enter' || event.key === 'Spacebar') {
                event.preventDefault();
                dispatch({ type: BACKWARD });
              }
            }}
            tabIndex={0}
          />
          <CarouselArrow
            direction="forward"
            onClick={() => dispatch({ type: FORWARD })}
            onKeyDown={(event) => {
              if (event.key === ' ' || event.key === 'Enter' || event.key === 'Spacebar') {
                event.preventDefault();
                dispatch({ type: FORWARD });
              }
            }}
            tabIndex={0}
          />
        </>
      )}
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
