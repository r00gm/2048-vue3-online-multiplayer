import {
  getEmptyTilesCoordinates,
  getRandomEmptyCoordinate,
  moveRight,
  moveLeft,
  rotateGridClockwise,
  rotateGridAntiClockwise,
  handleMoveRight,
  handleMoveLeft,
  handleMoveUp,
  handleMoveDown,
  equalGrids,
} from "../gameBoard";
import { OBSTACLE } from "@/constants";
import type { Tile } from "../gameBoard";
import { describe, expect, it } from "vitest";

describe("getEmptyTilesCoordinates", () => {
  it("should return the empty tiles coordinates", () => {
    const sample = [
      [0, 0, 1],
      [1, 0, 0],
      [1, 1, 1],
    ];
    const result = { 0: [0, 1], 1: [1, 2] };
    expect(getEmptyTilesCoordinates(sample)).toStrictEqual(result);
  });
});

describe("getRandomEmptyCoordinate", () => {
  it("should return the coordinate of an empty tile", () => {
    const sample = {
      4: [2],
    };
    const result = { y: 4, x: 2 };
    expect(getRandomEmptyCoordinate(sample)).toStrictEqual(result);
  });
});

describe("move array to sides", () => {
  it("should slide all numbers to the right", () => {
    const sample = [0, 1, 2, 0];
    const result = [0, 0, 1, 2];
    expect(moveRight(sample).list).toStrictEqual(result);
  });
  it("should merge same values to right", () => {
    expect(moveRight([0, 1, 1, 0]).list).toStrictEqual([0, 0, 0, 2]);
    expect(moveRight([0, 1, 1, 1]).list).toStrictEqual([0, 0, 1, 2]);
    expect(moveRight([1, 1, 1, 1]).list).toStrictEqual([0, 0, 2, 2]);
    expect(moveRight([0, 2, 2, 4]).list).toStrictEqual([0, 0, 4, 4]);
  });

  it("should slide all numbers to the left", () => {
    const sample = [0, 1, 2, 0];
    const result = [1, 2, 0, 0];
    expect(moveLeft(sample).list).toStrictEqual(result);
  });
  it("should merge same values to left", () => {
    expect(moveLeft([0, 1, 1, 0]).list).toStrictEqual([2, 0, 0, 0]);
    expect(moveLeft([0, 1, 1, 1]).list).toStrictEqual([2, 1, 0, 0]);
    expect(moveLeft([1, 1, 1, 1]).list).toStrictEqual([2, 2, 0, 0]);
    expect(moveLeft([1, 1, 1, 1]).list).toStrictEqual([2, 2, 0, 0]);
    expect(moveLeft([0, 2, 2, 4]).list).toStrictEqual([4, 4, 0, 0]);
  });
});

describe("rotate grid", () => {
  const initial = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  const rotateClocWise = [
    [7, 4, 1],
    [8, 5, 2],
    [9, 6, 3],
  ];
  it("should rotate clockwise", () => {
    expect(rotateGridClockwise(initial)).toStrictEqual(rotateClocWise);
  });
  it("should rotate anti clockwise", () => {
    expect(rotateGridAntiClockwise(rotateClocWise)).toStrictEqual(initial);
  });
});

describe("handle moves", () => {
  const initial = [
    [0, 1, 1, 2],
    [0, 1, 1, 0],
    [0, 1, 1, 1],
    [8, 0, 0, 0],
  ];
  describe("handleMoveRight", () => {
    it("should move all the grid to the right", () => {
      const result = [
        [0, 0, 2, 2],
        [0, 0, 0, 2],
        [0, 0, 1, 2],
        [0, 0, 0, 8],
      ];
      expect(handleMoveRight(initial).grid).toStrictEqual(result);
    });
  });

  describe("handleMoveLeft", () => {
    it("should move all the grid to the left", () => {
      const initial = [
        [0, 1, 1, 2],
        [0, 1, 1, 0],
        [0, 1, 1, 1],
        [8, 0, 0, 0],
      ];

      const result = [
        [2, 2, 0, 0],
        [2, 0, 0, 0],
        [2, 1, 0, 0],
        [8, 0, 0, 0],
      ];
      expect(handleMoveLeft(initial).grid).toStrictEqual(result);
    });
  });

  describe("handleMoveUp", () => {
    it("should move all the grid to the left", () => {
      const initial = [
        [0, 1, 1, 2],
        [0, 1, 1, 0],
        [0, 1, 1, 1],
        [8, 0, 0, 0],
      ];

      const result = [
        [8, 2, 2, 2],
        [0, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      expect(handleMoveUp(initial).grid).toStrictEqual(result);
    });
  });

  describe("handleMoveUp", () => {
    it("should move all the grid to the left", () => {
      const initial = [
        [0, 1, 1, 2],
        [0, 1, 1, 0],
        [0, 1, 1, 1],
        [8, 0, 0, 0],
      ];

      const result = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 1, 2],
        [8, 2, 2, 1],
      ];
      expect(handleMoveDown(initial).grid).toStrictEqual(result);
    });
  });
});

describe("equalGrids", () => {
  const initial = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  const other = [
    [1, 2, 3],
    [4, 0, 6],
    [7, 8, 9],
  ];
  it("is truthy", () => {
    expect(equalGrids(initial, initial)).toBe(true);
  });
  it("is falsy", () => {
    expect(equalGrids(initial, other)).toBe(false);
  });
});

describe("Feat: Obstacles", () => {
  const X = OBSTACLE;
  describe("Obstacles shall remain in place", () => {
    describe("move array to sides", () => {
      it("should slide all numbers to the right", () => {
        const sample: Tile[] = [1, 0, 4, X, 2, 2, 2, X, 2, 2, X];
        const result: Tile[] = [0, 1, 4, X, 0, 2, 4, X, 0, 4, X];
        expect(moveRight(sample).list).toStrictEqual(result);
      });
      it("should merge same values to left", () => {
        const sample: Tile[] = [1, 0, 4, X, 2, 2, 2, X, 2, 2, X];
        const result: Tile[] = [1, 4, 0, X, 4, 2, 0, X, 4, 0, X];
        expect(moveLeft(sample).list).toStrictEqual(result);
      });
    });
  });
});

describe("Feat: Score", () => {
  const X = OBSTACLE;
  it("should return a score when sliding rows", () => {
    const sample: Tile[] = [1, 0, 4, X, 2, 2, 2, X, 2, 2, X];
    expect(moveRight(sample).moveScore).toBe(8);
    expect(moveLeft(sample).moveScore).toBe(8);
  });

  it("should return a score when sliding the entire grid", () => {
    const sample = [
      [0, 1, 1, 2],
      [0, 1, 1, 0],
      [0, 1, 1, 2],
      [8, 0, 0, 0],
    ];

    expect(handleMoveUp(sample).score).toBe(8);
    expect(handleMoveDown(sample).score).toStrictEqual(8);
  });
});
