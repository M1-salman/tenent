/*
  Warnings:

  - You are about to drop the `TotalTenants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TotalTenants" DROP CONSTRAINT "TotalTenants_userId_fkey";

-- DropTable
DROP TABLE "TotalTenants";
