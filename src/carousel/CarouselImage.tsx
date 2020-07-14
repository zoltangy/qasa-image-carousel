import React from 'react';
import { makeStyles } from '@material-ui/styles';

export type CarouselImageProps = {
  src: string;
  index: number;
};

export const CarouselImage: React.FC<CarouselImageProps> = ({ src, index }) => {
  const classes = useStyles();
  return <img src={src} alt={'Image #' + index} className={classes.image} />;
};

const useStyles = makeStyles({
  image: {
    width: '100%',
    height: '100%',
  },
});
