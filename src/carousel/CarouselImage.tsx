import React from 'react';
import { makeStyles } from '@material-ui/styles';

type CarouselImageProps = {
  src: string;
  index: number;
};

export const CarouselImage: React.FC<CarouselImageProps> = ({ src, index }) => {
  const classes = useStyles();
  return (
    <div className={classes.imageWrapper}>
      <img src={src} alt={'Image #' + index} className={classes.image} />
    </div>
  );
};

const useStyles = makeStyles({
  imageWrapper: {
    flex: '1 0 100%',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
});
