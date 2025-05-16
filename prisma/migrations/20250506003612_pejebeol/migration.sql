/*
  Warnings:

  - Added the required column `admin_id` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chat_user_id` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chats` ADD COLUMN `admin_id` INTEGER NOT NULL,
    ADD COLUMN `chat_user_id` INTEGER NOT NULL;
