/*
  Warnings:

  - Added the required column `active` to the `drivers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "active" BOOLEAN NOT NULL;
