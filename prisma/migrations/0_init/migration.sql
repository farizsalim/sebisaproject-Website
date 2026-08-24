-- CreateTable
CREATE TABLE `auditlog` (
    `id` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_actorId_idx`(`actorId` ASC),
    INDEX `AuditLog_createdAt_idx`(`createdAt` ASC),
    INDEX `AuditLog_entityType_entityId_idx`(`entityType` ASC, `entityId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `logoPath` VARCHAR(191) NOT NULL,
    `websiteUrl` VARCHAR(191) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Client_isPublished_sortOrder_idx`(`isPublished` ASC, `sortOrder` ASC),
    UNIQUE INDEX `Client_logoPath_key`(`logoPath` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invite` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'EDITOR') NOT NULL DEFAULT 'EDITOR',
    `tokenHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `invitedById` VARCHAR(191) NOT NULL,
    `acceptedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Invite_email_idx`(`email` ASC),
    INDEX `Invite_expiresAt_idx`(`expiresAt` ASC),
    INDEX `Invite_invitedById_fkey`(`invitedById` ASC),
    UNIQUE INDEX `Invite_tokenHash_key`(`tokenHash` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service` (
    `id` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `originalPrice` VARCHAR(191) NOT NULL DEFAULT '',
    `price` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL DEFAULT '',
    `description` VARCHAR(191) NOT NULL,
    `flashSale` BOOLEAN NOT NULL DEFAULT false,
    `discount` INTEGER NOT NULL DEFAULT 0,
    `flashSaleEndsAt` DATETIME(3) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `benefits` JSON NULL,
    `isRecommended` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `service_categoryId_name_key`(`categoryId` ASC, `name` ASC),
    INDEX `service_categoryId_sortOrder_idx`(`categoryId` ASC, `sortOrder` ASC),
    INDEX `service_flashSale_idx`(`flashSale` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_category` (
    `id` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL DEFAULT 'chart',
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `service_category_isPublished_sortOrder_idx`(`isPublished` ASC, `sortOrder` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sitecontent` (
    `id` VARCHAR(191) NOT NULL,
    `contentKey` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SiteContent_contentKey_key`(`contentKey` ASC),
    INDEX `SiteContent_isPublished_idx`(`isPublished` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'EDITOR') NOT NULL DEFAULT 'EDITOR',
    `status` ENUM('INVITED', 'ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'INVITED',
    `emailVerified` DATETIME(3) NULL,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email` ASC),
    INDEX `User_role_idx`(`role` ASC),
    INDEX `User_status_idx`(`status` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `auditlog` ADD CONSTRAINT `AuditLog_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invite` ADD CONSTRAINT `Invite_invitedById_fkey` FOREIGN KEY (`invitedById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `service_category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
