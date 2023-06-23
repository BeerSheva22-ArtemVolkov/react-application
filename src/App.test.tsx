import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { matrixSum, range } from './util/number-functions';

test("sum of matrix", () => {
  expect(matrixSum([[1, 2, 3], [4, 5, 6]])).toEqual(21)
})
