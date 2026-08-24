-- AlterTable
ALTER TABLE `payment_order` ADD COLUMN `couponCode` VARCHAR(191) NULL,
    ADD COLUMN `couponId` VARCHAR(191) NULL,
    ADD COLUMN `discountAmount` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `type` ENUM('PERCENTAGE', 'FIXED') NOT NULL,
    `value` INTEGER NOT NULL,
    `minAmount` INTEGER NOT NULL DEFAULT 0,
    `maxUses` INTEGER NULL,
    `usedCount` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `startsAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Coupon_code_key`(`code`),
    INDEX `Coupon_isActive_startsAt_expiresAt_idx`(`isActive`, `startsAt`, `expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment_order` ADD CONSTRAINT `payment_order_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
