/*
  Warnings:

  - You are about to drop the column `questionId` on the `Answer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[answerId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_questionId_fkey`;

-- DropIndex
DROP INDEX `Answer_questionId_key` ON `Answer`;

-- AlterTable
ALTER TABLE `Answer` DROP COLUMN `questionId`;

-- AlterTable
ALTER TABLE `Question` ADD COLUMN `answerId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Question_answerId_key` ON `Question`(`answerId`);

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_answerId_fkey` FOREIGN KEY (`answerId`) REFERENCES `Answer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
