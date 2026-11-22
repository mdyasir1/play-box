-- CreateTable
CREATE TABLE "progress" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "game" TEXT NOT NULL,
    "currentLevel" INTEGER NOT NULL DEFAULT 1,
    "completed" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "bestScores" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "progress_userId_idx" ON "progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "progress_userId_game_key" ON "progress"("userId", "game");

-- Constraints
ALTER TABLE "progress"
    ADD CONSTRAINT "progress_game_check" CHECK ("game" IN ('zip', 'maze-paint'));

ALTER TABLE "progress"
    ADD CONSTRAINT "progress_current_level_check" CHECK ("currentLevel" BETWEEN 1 AND 200);

-- Row Level Security
ALTER TABLE "progress" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_progress" ON "progress"
    FOR ALL
    USING (auth.uid() = "userId")
    WITH CHECK (auth.uid() = "userId");
