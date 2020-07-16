import React from 'react';
import { makeStyles } from '@material-ui/styles';
//--
import { Carousel } from './carousel/Carousel';

const imageList = [
  { url: 'https://picsum.photos/2000/1200?random=' + Math.random() * 1000 },
  { url: 'https://picsum.photos/2000/1200?random=' + Math.random() * 1000 },
  { url: 'https://picsum.photos/1200/2000?random=' + Math.random() * 1000 },
  { url: 'https://picsum.photos/2000/1200?random=' + Math.random() * 1000 },
  { url: 'https://picsum.photos/2000/1200?random=' + Math.random() * 1000 },
  { url: 'https://picsum.photos/2000/1200?random=' + Math.random() * 1000 },
];

export const App: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.carouselContainer}>
      <Carousel data={imageList} />
    </div>
  );
};

const useStyles = makeStyles({
  carouselContainer: {
    width: '65%',
    height: '80%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});
