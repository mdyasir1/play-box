# Project Overview — YASIR PLAYBOX

> Product summary. Requirements are canonical in `PROJECT_SPEC.md`.

## Identity

- **Name:** YASIR PLAYBOX
- **Tagline:** Your Personal Arcade.
- **Type:** Private single-player browser arcade.
- **Primary device:** Modern phone; desktop and tablet supported.
- **Status:** Version 1.0.0, complete and verified locally.

## Purpose

YASIR PLAYBOX is a small, polished arcade with exactly two puzzle games. It is
built for short breaks: open the site, pick a puzzle, play a level, and keep
your best result on the device. There is no account, no network dependency,
and no filler.

## The two games

| Game | Objective | Skill | Levels |
|---|---|---|---|
| **Zip** | Draw one continuous path through every grid cell, visiting numbered checkpoints in order | Route planning and spatial reasoning | 100 |
| **Maze Paint** | Slide a roller until it stops against a wall, painting every open tile | Planning and efficient movement | 100 |

Both games are fully playable. Every level is unlocked. Each level stores a
best result locally.

## Experience

1. **Home:** progress summary, both game cards, rules, and a direct play link.
2. **Game:** level header, previous/next controls, level picker, board, live
   statistics, undo/restart, and input help.
3. **Result:** completion dialog with statistics and next/replay/levels actions.
4. **Return:** the current level and best results are restored from localStorage.

## Principles

- Two games done properly, not five done partially.
- Local-first and private by default.
- Touch, pointer, and keyboard parity.
- Honest progress; no fabricated data.
- Calm visual design with clear feedback.
- Verified level data and automated browser coverage.

## What is deliberately absent

Accounts, cloud sync, multiplayer, achievements, daily challenges, PWA install,
leaderboards, analytics, advertising, and additional games. Supabase is not
used, so no database credentials are needed.

## Definition of success

A player can finish a Zip level by dragging, finish a Maze Paint level with the
keyboard or swipe, choose any of the 100 levels in either game, reload the page,
and find the same current level and saved best results intact. The full test
suite and production build pass.
