import React from 'react';
import { makeStyles, DefaultTheme } from '@material-ui/styles';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

type CarouselArrowProps = {
  direction: 'forward' | 'backward';
};

export const CarouselArrow: React.FC<React.ComponentProps<'div'> & CarouselArrowProps> = ({
  direction,
  ...rest
}) => {
  const classes = useStyles({ direction });
  return (
    <div className={classes.arrowWrapper} {...rest}>
      {direction === 'forward' ? <IoIosArrowForward /> : <IoIosArrowBack />}
    </div>
  );
};

const useStyles = makeStyles<DefaultTheme, CarouselArrowProps>({
  arrowWrapper: (props) => ({
    height: '100%',
    left: props.direction === 'backward' ? 0 : '',
    right: props.direction === 'forward' ? 0 : '',
    top: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 50,
    '&:hover': {
      color: 'rgba(140, 140, 140, 0.9)',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    transition: 'all 0.4s ease',
  }),
});
