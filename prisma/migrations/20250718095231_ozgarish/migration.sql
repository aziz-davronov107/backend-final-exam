/*
  Warnings:

  - You are about to drop the column `permissionId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "permissionId",
ALTER COLUMN "role" DROP NOT NULL;
