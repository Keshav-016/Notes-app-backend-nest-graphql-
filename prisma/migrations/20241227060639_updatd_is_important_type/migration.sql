/*
  Warnings:

  - Changed the type of `isImportant` on the `Notes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "isImportant",
ADD COLUMN     "isImportant" BOOLEAN NOT NULL;
