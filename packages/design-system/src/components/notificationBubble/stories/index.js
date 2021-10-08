/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { number } from '@storybook/addon-knobs';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Headline } from '../../typography';
import { DarkThemeProvider } from '../../../storybookUtils';
import { NotificationBubble, BADGE_VARIANTS } from '..';

export default {
  title: 'DesignSystem/Components/NotificationBubble',
  component: NotificationBubble,
};

const VARIANT_OPTIONS = Object.values(BADGE_VARIANTS);

const Container = styled.div`
  display: grid;
  row-gap: 20px;
  padding: 20px 50px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.standard.black};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-column: 1 / -1;

  label {
    display: flex;
    align-items: center;
  }
`;

export const _default = () => {
  return (
    <>
      <Headline as="h1">{'Notification Bubble'}</Headline>
      <br />
      <Container>
        <Row>
          {VARIANT_OPTIONS.map((variant) => (
            <NotificationBubble
              key={variant}
              notificationCount={number('Notification Count', 6)}
              variant={variant}
            />
          ))}
        </Row>
      </Container>
      <DarkThemeProvider>
        <Container>
          <Row>
            {VARIANT_OPTIONS.map((variant) => (
              <NotificationBubble
                key={variant}
                notificationCount={number('Notification Count', 6)}
                variant={variant}
              />
            ))}
          </Row>
        </Container>
      </DarkThemeProvider>
    </>
  );
};
