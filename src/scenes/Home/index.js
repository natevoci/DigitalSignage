import React from 'react';
import styled from '@emotion/styled';

const Column = styled.div`
  width: 50%;
  height: 100%;
  position: relative;
`;

import { Layout } from '../../ui';
import { Pane } from './Pane';

export default () => {
  const query = new URLSearchParams(window.location.search);
  const leftSources = query.get('left');
  const rightSources = query.get('right');

  return (
    <Layout>
      <Column>
        <Pane
          sourceQuery={leftSources}
        />
      </Column>
      <Column>
        <Pane
          sourceQuery={rightSources}
        />
      </Column>
    </Layout>
  )
};
