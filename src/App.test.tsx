import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { matrixSum, range } from './util/number-functions';
import LifeMatrix from './service/LifeMatrix';
import lifeConfig from "./config/live-game-config.json"
const { dimension, tick } = lifeConfig;

test("sum of matrix", () => {
  expect(matrixSum([[1, 2, 3], [4, 5, 6]])).toEqual(21)
})

test("range test", () => {
  const lifeMatrix = new LifeMatrix(lifeConfig.example1)
  lifeMatrix.next()
  
  expect(lifeMatrix.numbers).toEqual([[0, 0, 0], [1, 1, 1], [0, 0, 0]])
  lifeMatrix.next()
  expect(lifeMatrix.numbers).toEqual([[0, 1, 0], [0, 1, 0], [0, 1, 0]])
})