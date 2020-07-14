import React from 'react';
import { makeStyles } from '@material-ui/styles';
//--
import { CarouselImage } from './CarouselImage';

export type CarouselProps = {
  data: { url: string }[];
};

export const Carousel: React.FC<CarouselProps> = ({ data }) => {
  const classes = useStyles();
  return (
    <div className={classes.carousel}>
      {data.map((item, index) => (
        <CarouselImage key={item.url} src={item.url} index={index} />
      ))}
    </div>
  );
};

const useStyles = makeStyles({
  carousel: {},
});
