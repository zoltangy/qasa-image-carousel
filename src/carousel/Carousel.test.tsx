import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Carousel } from './Carousel';
import img1 from '../../assets/1.jpg';
import img2 from '../../assets/2.jpg';
import img3 from '../../assets/3.jpg';

const data = [
  {
    url: img1,
  },
  {
    url: img2,
  },
  {
    url: img3,
  },
];

const width = 1024;

window.HTMLElement.prototype.getBoundingClientRect = function () {
  return {
    width: width,
    height: 0,
    top: 0,
    left: 0,
    x: 0,
    y: 0,
    bottom: 0,
    right: 0,
    toJSON: () => {},
  };
};

describe('Carousel tests', () => {
  // verify that images slide to the right place and correct 'dot' is highlighted
  const validateState = (activeImage: number) => {
    expect(screen.getByTestId('wrapper')).toHaveStyle(`left: ${width * -1 * activeImage}px`);
    for (let i = 0; i < 3; i++) {
      if (i === activeImage - 1) {
        expect(screen.getByRole('button', { name: 'image-' + i })).toHaveStyle('background-color: white');
      } else {
        expect(screen.getByRole('button', { name: 'image-' + i })).not.toHaveStyle('background-color: white');
      }
    }
  };

  // click button, fire transitionEnd event manually
  const goForward = () => {
    userEvent.click(screen.getByRole('button', { name: 'forward' }));
    fireEvent.transitionEnd(screen.getByTestId('wrapper'));
  };

  const goBackward = () => {
    userEvent.click(screen.getByRole('button', { name: 'backward' }));
    fireEvent.transitionEnd(screen.getByTestId('wrapper'));
  };

  it('goes forward and wraps correctly', async () => {
    const { getByAltText, getByRole } = render(
      <div>
        <Carousel data={data} preloadImages={false} />
      </div>
    );

    expect(getByAltText(/Image #1/i)).toBeVisible();
    expect(getByAltText(/Image #2/i)).toBeVisible();
    expect(getByAltText(/Image #3/i)).toBeVisible();
    expect(getByRole('button', { name: 'forward' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'backward' })).toBeInTheDocument();
    validateState(1);

    goForward();
    validateState(2);

    goForward();
    validateState(3);

    goForward();
    validateState(1);

    goForward();
    validateState(2);

    goForward();
    validateState(3);
  });

  it('goes backward and wraps correctly', async () => {
    render(
      <div>
        <Carousel data={data} preloadImages={false} />
      </div>
    );

    validateState(1);

    goBackward();
    validateState(3);

    goBackward();
    validateState(2);

    goBackward();
    validateState(1);

    goBackward();
    validateState(3);

    goBackward();
    validateState(2);
  });

  it('jumps to the correct image when clicked', async () => {
    const { getByTestId, getByRole } = render(
      <div>
        <Carousel data={data} preloadImages={false} />
      </div>
    );

    validateState(1);

    userEvent.click(getByRole('button', { name: 'image-2' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    validateState(3);

    userEvent.click(getByRole('button', { name: 'image-0' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    validateState(1);

    userEvent.click(getByRole('button', { name: 'image-1' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    validateState(2);
  });

  it('is possible to navigate with the arrow keys', async () => {
    const { getByTestId } = render(
      <div>
        <Carousel data={data} preloadImages={false} />
      </div>
    );

    validateState(1);

    fireEvent.keyDown(document, { key: 'ArrowLeft', code: 'ArrowLeft' });
    fireEvent.transitionEnd(getByTestId('wrapper'));
    validateState(3);

    fireEvent.keyDown(document, { key: 'ArrowRight', code: 'ArrowRight' });
    fireEvent.transitionEnd(getByTestId('wrapper'));
    validateState(1);
  });
});
