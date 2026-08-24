-- CreateTable
CREATE TABLE `payment_order` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `customerEmail` VARCHAR(191) NOT NULL,
    `customerPhone` VARCHAR(191) NOT NULL,
    `grossAmount` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'SETTLEMENT', 'CAPTURE', 'DENY', 'CANCEL', 'EXPIRE', 'REFUND', 'UNKNOWN') NOT NULL DEFAULT 'PENDING',
    `transactionId` VARCHAR(191) NULL,
    `paymentType` VARCHAR(191) NULL,
    `fraudStatus` VARCHAR(191) NULL,
    `rawNotification` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `paidAt` DATETIME(3) NULL,

    UNIQUE INDEX `payment_order_orderId_key`(`orderId`),
    INDEX `payment_order_serviceId_idx`(`serviceId`),
    INDEX `payment_order_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment_order` ADD CONSTRAINT `payment_order_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
