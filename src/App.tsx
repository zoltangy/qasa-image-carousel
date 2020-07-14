import React from 'react';
import { makeStyles } from '@material-ui/styles';
//--
import { Carousel } from './carousel/Carousel';

const imageList: { url: string }[] = [
  { url: 'https://picsum.photos/2000/1200?random=' + Math.random() * 1000 },
  { url: 'https://picsum.photos/2000/1200?random=' + Math.random() * 1000 },
  { url: 'https://picsum.photos/2000/1200?random=' + Math.random() * 1000 },
  { url: 'https://picsum.photos/2000/1200?random=' + Math.random() * 1000 },
  { url: 'https://picsum.photos/2000/1200?random=' + Math.random() * 1000 },
  { url: 'https://picsum.photos/2000/1200?random=' + Math.random() * 1000 },
];

export const App: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.app}>
      <div className={classes.carouselContainer}>
        <Carousel data={imageList} />
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  app: {
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    width: '60%',
  },
});
