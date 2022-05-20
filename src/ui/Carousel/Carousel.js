import React from 'react';
import styled from '@emotion/styled';
import useForceUpdate from 'use-force-update';

import { useRssImages } from './useRssImages';

const ImgContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: ${p => p.$isCurrent ? '1' : '0'};
  transition: opacity 2s ease-in-out;

  img {
    max-width: 100%;
  }
`;

export const Carousel = ({
  categories,
}) => {

  const forceUpdate = useForceUpdate();
  const images = useRssImages({
    categories,
  });
  const imageIndexRef = React.useRef(-1);


  React.useEffect(
    () => {
      if (imageIndexRef.current === -1 || imageIndexRef.current >= images.length) {
        imageIndexRef.current = 0;
        forceUpdate();
      }
    },
    [images],
  );

  React.useEffect(
    () => {
      if (!images.length) {
        return;
      }

      const handle = setTimeout(
        () => {
          imageIndexRef.current += 1;
          if (imageIndexRef.current === -1 || imageIndexRef.current >= images.length) {
            imageIndexRef.current = 0;
          }
          forceUpdate();
        },
        images[imageIndexRef.current].fadeInterval * 1000,
      );

      return () => {
        clearTimeout(handle);
      }
    },
    [imageIndexRef.current, images],
  )

  return images.map((image, index) => (
    <ImgContainer
      key={image.src}
      $isCurrent={index === imageIndexRef.current}
    >
      <img src={image.src} />
    </ImgContainer>
  ));
};
