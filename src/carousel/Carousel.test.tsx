import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
  it('goes forward and wraps correctly', async () => {
    const { getByTestId, getByAltText, getByRole } = render(
      <div>
        <Carousel data={data} preloadImages={false} />
      </div>
    );

    expect(getByAltText(/Image #1/i)).toBeVisible();
    expect(getByAltText(/Image #2/i)).toBeVisible();
    expect(getByAltText(/Image #3/i)).toBeVisible();
    expect(getByRole('button', { name: 'forward' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'backward' })).toBeInTheDocument();
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -1}px`);
    expect(getByRole('button', { name: 'image-0' })).toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).not.toHaveStyle('background-color: white');

    // click button, fire transitionEnd event manually, verify that images slide and correct 'dot' is highlighted
    userEvent.click(getByRole('button', { name: 'forward' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -2}px`);
    expect(getByRole('button', { name: 'image-0' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).not.toHaveStyle('background-color: white');

    userEvent.click(getByRole('button', { name: 'forward' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -3}px`);
    expect(getByRole('button', { name: 'image-0' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).toHaveStyle('background-color: white');

    userEvent.click(getByRole('button', { name: 'forward' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -1}px`);
    expect(getByRole('button', { name: 'image-0' })).toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).not.toHaveStyle('background-color: white');

    userEvent.click(getByRole('button', { name: 'forward' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -2}px`);
    expect(getByRole('button', { name: 'image-0' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).not.toHaveStyle('background-color: white');

    userEvent.click(getByRole('button', { name: 'forward' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -3}px`);
    expect(getByRole('button', { name: 'image-0' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).toHaveStyle('background-color: white');
  });

  it('goes backward and wraps correctly', async () => {
    const { getByTestId, getByRole } = render(
      <div>
        <Carousel data={data} preloadImages={false} />
      </div>
    );

    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -1}px`);
    expect(getByRole('button', { name: 'image-0' })).toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).not.toHaveStyle('background-color: white');

    // click button, fire transitionEnd event manually, verify that images slide and correct 'dot' is highlighted
    userEvent.click(getByRole('button', { name: 'backward' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -3}px`);
    expect(getByRole('button', { name: 'image-0' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).toHaveStyle('background-color: white');

    userEvent.click(getByRole('button', { name: 'backward' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -2}px`);
    expect(getByRole('button', { name: 'image-0' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).not.toHaveStyle('background-color: white');

    userEvent.click(getByRole('button', { name: 'backward' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -1}px`);
    expect(getByRole('button', { name: 'image-0' })).toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).not.toHaveStyle('background-color: white');

    userEvent.click(getByRole('button', { name: 'backward' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -3}px`);
    expect(getByRole('button', { name: 'image-0' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).toHaveStyle('background-color: white');

    userEvent.click(getByRole('button', { name: 'backward' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -2}px`);
    expect(getByRole('button', { name: 'image-0' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).not.toHaveStyle('background-color: white');
  });

  it('jumps to the correct image when clicked', async () => {
    const { getByTestId, getByRole } = render(
      <div>
        <Carousel data={data} preloadImages={false} />
      </div>
    );

    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -1}px`);
    expect(getByRole('button', { name: 'image-0' })).toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).not.toHaveStyle('background-color: white');

    // click button, fire transitionEnd event manually, verify that images slide and correct 'dot' is highlighted
    userEvent.click(getByRole('button', { name: 'image-2' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -3}px`);
    expect(getByRole('button', { name: 'image-0' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).toHaveStyle('background-color: white');

    userEvent.click(getByRole('button', { name: 'image-0' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -1}px`);
    expect(getByRole('button', { name: 'image-0' })).toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).not.toHaveStyle('background-color: white');

    userEvent.click(getByRole('button', { name: 'image-1' }));
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -2}px`);
    expect(getByRole('button', { name: 'image-0' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).not.toHaveStyle('background-color: white');
  });

  it('is possible to navigate with the arrow keys', async () => {
    const { getByTestId, getByRole } = render(
      <div>
        <Carousel data={data} preloadImages={false} />
      </div>
    );

    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -1}px`);
    expect(getByRole('button', { name: 'image-0' })).toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).not.toHaveStyle('background-color: white');

    fireEvent.keyDown(document, { key: 'ArrowLeft', code: 'ArrowLeft' });
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -3}px`);
    expect(getByRole('button', { name: 'image-0' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).toHaveStyle('background-color: white');

    fireEvent.keyDown(document, { key: 'ArrowRight', code: 'ArrowRight' });
    fireEvent.transitionEnd(getByTestId('wrapper'));
    expect(getByTestId('wrapper')).toHaveStyle(`left: ${width * -1}px`);
    expect(getByRole('button', { name: 'image-0' })).toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-1' })).not.toHaveStyle('background-color: white');
    expect(getByRole('button', { name: 'image-2' })).not.toHaveStyle('background-color: white');
  });
});
