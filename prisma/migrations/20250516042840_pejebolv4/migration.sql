/*
  Warnings:

  - The values [cancel] on the enum `checkouts_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `checkouts` MODIFY `status` ENUM('pending', 'processing', 'success', 'failed') NOT NULL DEFAULT 'pending';
