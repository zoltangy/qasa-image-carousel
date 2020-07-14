import React, { useState, useEffect } from 'react';
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

  // Hide button outline by default, add it back if Tab is pressed
  const [keyboardUser, setKeyboardUser] = useState(false);
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        setKeyboardUser(true);
        document.removeEventListener('keydown', handleKeyDown);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  let className = classes.arrowWrapper;
  if (!keyboardUser) className += ' ' + classes.noOutline;
  return (
    <div className={className} {...rest} role="button" aria-label={direction}>
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
    fontSize: '4.5vw',
    '&:hover': {
      color: 'rgba(140, 140, 140, 0.9)',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    transition: 'all 0.4s ease',
  }),
  noOutline: {
    '&:focus': {
      outline: 'none',
    },
  },
});
