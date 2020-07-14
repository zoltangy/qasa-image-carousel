import React from 'react';
import { makeStyles } from '@material-ui/styles';

type CarouselIndicatorProps = {
  active: number;
  numItems: number;
  goTo: (target: number) => void;
};

export const CarouselIndicator: React.FC<CarouselIndicatorProps> = ({ active, numItems, goTo }) => {
  const classes = useStyles();
  return (
    <div className={classes.indicatorWrapper}>
      {Array.from(Array(numItems)).map((item, index) => (
        <div
          className={active === index ? `${classes.indicator} ${classes.indicatorActive}` : classes.indicator}
          onClick={() => goTo(index)}
          key={index}
        ></div>
      ))}
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
