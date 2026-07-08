-- DropForeignKey
ALTER TABLE "GameFoundCharacter" DROP CONSTRAINT "GameFoundCharacter_gameId_fkey";

-- AddForeignKey
ALTER TABLE "GameFoundCharacter" ADD CONSTRAINT "GameFoundCharacter_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
