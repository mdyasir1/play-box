export interface ZipCheckpoint {
  value: number;
  cell: number;
}

export interface ZipLevel {
  id: string;
  number: number;
  size: number;
  checkpoints: ZipCheckpoint[];
  solution: number[];
}

export type ZipRejection =
  | "start-at-one"
  | "not-started"
  | "not-adjacent"
  | "already-used"
  | "checkpoint-order";

export type ZipMoveResult = {
  path: number[];
  accepted: boolean;
  reason?: ZipRejection;
};

export type ZipValidation = {
  valid: boolean;
  reason?:
    | "empty"
    | "duplicate-cell"
    | "not-adjacent"
    | "incomplete"
    | "checkpoint-missing"
    | "checkpoint-order";
};
