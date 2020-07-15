import React from 'react';
import { makeStyles } from '@material-ui/styles';
//--
import { Action, JUMP } from './Carousel';

type CarouselIndicatorProps = {
  active: number;
  numItems: number;
  dispatch: React.Dispatch<Action>;
};

export const CarouselIndicator: React.FC<CarouselIndicatorProps> = ({ active, numItems, dispatch }) => {
  const classes = useStyles();
  return (
    <div className={classes.indicatorWrapper}>
      {Array.from(Array(numItems)).map((item, index) => {
        let className = classes.indicator;
        if (active === index) className += ' ' + classes.indicatorActive;
        return (
          <div
            className={className}
            onClick={() => dispatch({ type: JUMP, payload: index + 1 })}
            key={index}
            role="button"
            aria-label={'image-' + index}
          ></div>
        );
      })}
    </div>
  );
};

const useStyles = makeStyles({
  indicatorWrapper: {
    width: '100%',
    bottom: 30,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  indicator: {
    height: 8,
    width: 8,
    margin: '0 4px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '50%',
    transition: 'all 0.7s ease',
    cursor: 'pointer',
  },
  indicatorActive: {
    backgroundColor: 'white',
  },
});
