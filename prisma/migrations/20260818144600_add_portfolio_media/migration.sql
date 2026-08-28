-- CreateTable
CREATE TABLE `portfolio_project` (
    `id` VARCHAR(191) NOT NULL,
    `clientName` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT '',
    `description` TEXT NOT NULL,
    `result` TEXT NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `portfolio_project_slug_key`(`slug`),
    INDEX `portfolio_project_isPublished_sortOrder_idx`(`isPublished`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portfolio_media` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `mediaType` ENUM('IMAGE', 'VIDEO') NOT NULL,
    `section` ENUM('PORTFOLIO', 'BEHIND_SCENES', 'BOTH') NOT NULL DEFAULT 'PORTFOLIO',
    `filePath` VARCHAR(191) NOT NULL,
    `thumbnailPath` VARCHAR(191) NULL,
    `originalName` VARCHAR(191) NOT NULL DEFAULT '',
    `mimeType` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `caption` TEXT NOT NULL,
    `altText` VARCHAR(191) NOT NULL DEFAULT '',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `portfolio_media_projectId_section_isPublished_sortOrder_idx`(`projectId`, `section`, `isPublished`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `portfolio_media` ADD CONSTRAINT `portfolio_media_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `portfolio_project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
