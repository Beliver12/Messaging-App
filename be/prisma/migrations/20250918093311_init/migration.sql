/*
  Warnings:

  - You are about to drop the column `userId` on the `UsersInChat` table. All the data in the column will be lost.
  - Added the required column `friendsId` to the `UsersInChat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsersInChat" DROP CONSTRAINT "UsersInChat_userId_fkey";

-- AlterTable
ALTER TABLE "UsersInChat" DROP COLUMN "userId",
ADD COLUMN     "friendsId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UsersInChat" ADD CONSTRAINT "UsersInChat_friendsId_fkey" FOREIGN KEY ("friendsId") REFERENCES "Friends"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
