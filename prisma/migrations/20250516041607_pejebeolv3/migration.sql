/*
  Warnings:

  - You are about to drop the `status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `status` DROP FOREIGN KEY `status_deliveries_id_fkey`;

-- AlterTable
ALTER TABLE `checkouts` ADD COLUMN `snap_token` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `deliveries` MODIFY `send_start_time` DATETIME(3) NULL,
    MODIFY `send_end_time` DATETIME(3) NULL;

-- DropTable
DROP TABLE `status`;

-- CreateTable
CREATE TABLE `delivery_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NULL,
    `deliveries_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `delivery_status` ADD CONSTRAINT `delivery_status_deliveries_id_fkey` FOREIGN KEY (`deliveries_id`) REFERENCES `deliveries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
