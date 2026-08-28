CREATE TABLE `behind_scene` (
    `id` VARCHAR(191) NOT NULL,
    `mediaType` ENUM('IMAGE', 'VIDEO') NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `thumbnailPath` VARCHAR(191) NULL,
    `originalName` VARCHAR(191) NOT NULL DEFAULT '',
    `mimeType` VARCHAR(191) NOT NULL DEFAULT '',
    `fileSize` INTEGER NOT NULL DEFAULT 0,
    `description` TEXT NOT NULL,
    `altText` VARCHAR(191) NOT NULL DEFAULT '',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `behind_scene_isPublished_sortOrder_idx`(`isPublished`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;