export type MazeDirection = "up" | "down" | "left" | "right";

export interface MazeLevel {
  id: string;
  number: number;
  width: number;
  height: number;
  rows: string[];
  start: [number, number];
  par: number;
  solution: string;
}

export interface MazeState {
  row: number;
  col: number;
  painted: number[];
}

export interface MazeMoveResult {
  state: MazeState;
  moved: boolean;
}
