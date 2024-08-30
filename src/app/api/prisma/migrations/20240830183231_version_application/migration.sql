-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0;
