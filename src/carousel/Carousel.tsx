import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
//--
import { CarouselImage } from './CarouselImage';

// TODO: dummy width for now, get it dynamically
const width = 1000;

export type CarouselProps = {
  data: { url: string }[];
};

export const Carousel: React.FC<CarouselProps> = ({ data }) => {
  const classes = useStyles();
  const [pos, setPos] = useState(0);

  const goForward = () => setPos((p) => (p === data.length - 1 ? 0 : p + 1));
  const goBackward = () => setPos((p) => (p === 0 ? data.length - 1 : p - 1));

  return (
    <div className={classes.wrapper}>
      <div className={classes.carousel} style={{ left: pos * width * -1 }}>
        {data.map((item, index) => (
          <CarouselImage key={item.url} src={item.url} index={index} />
        ))}
      </div>
      <button onClick={() => goBackward()}>backwards</button>
      <button onClick={() => goForward()}>forward</button>
    </div>
  );
};

const useStyles = makeStyles({
  wrapper: {
    overflow: 'hidden',
  },
  carousel: {
    position: 'relative',
    transition: 'all 1s ease',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
});
