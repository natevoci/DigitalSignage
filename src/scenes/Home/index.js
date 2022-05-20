import React from 'react';
import styled from '@emotion/styled';

const Column = styled.div`
  width: 50%;
  height: 100%;
  position: relative;
`;

import { Layout, Carousel } from '../../ui';

export default () => {
  const query = new URLSearchParams(window.location.search);
  const leftCategories = query.get('left')?.split(',')?.map(val => `https://digitalsignage.manninghamuc.org/${val}/feed/`);
  const rightCategories = query.get('right')?.split(',')?.map(val => `https://digitalsignage.manninghamuc.org/${val}/feed/`);

  return (
    <Layout>
      <Column>
        {leftCategories ? (
          <Carousel
            categories={leftCategories}
          />
        ) : null}
      </Column>
      <Column>
        {rightCategories ? (
          <Carousel
            categories={rightCategories}
          />
        ) : null}
      </Column>
    </Layout>
  )
};
