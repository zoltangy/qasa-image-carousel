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
  return (
    <div>
      <Carousel data={imageList} />
    </div>
  );
};

const useStyles = makeStyles({
  carousel: {
    width: 1000,
    height: 600,
  },
});
