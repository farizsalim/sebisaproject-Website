-- DropIndex
DROP INDEX `consultation_submission_createdAt_idx` ON `consultation_submission`;

-- AlterTable
ALTER TABLE `consultation_submission` ADD COLUMN `quizId` VARCHAR(191) NULL,
    ADD COLUMN `quizVersion` INTEGER NULL;

-- CreateTable
CREATE TABLE `ConsultationQuiz` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `startNodeId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ConsultationQuiz_slug_key`(`slug`),
    INDEX `ConsultationQuiz_isPublished_idx`(`isPublished`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConsultationQuizNode` (
    `id` VARCHAR(191) NOT NULL,
    `quizId` VARCHAR(191) NOT NULL,
    `type` ENUM('QUESTION', 'RESULT') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `positionX` DOUBLE NOT NULL DEFAULT 0,
    `positionY` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ConsultationQuizNode_quizId_type_idx`(`quizId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConsultationQuizOption` (
    `id` VARCHAR(191) NOT NULL,
    `nodeId` VARCHAR(191) NOT NULL,
    `targetNodeId` VARCHAR(191) NULL,
    `label` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `ConsultationQuizOption_nodeId_sortOrder_idx`(`nodeId`, `sortOrder`),
    INDEX `ConsultationQuizOption_targetNodeId_idx`(`targetNodeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConsultationQuizOptionScore` (
    `id` VARCHAR(191) NOT NULL,
    `optionId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 0,

    INDEX `ConsultationQuizOptionScore_serviceId_idx`(`serviceId`),
    UNIQUE INDEX `ConsultationQuizOptionScore_optionId_serviceId_key`(`optionId`, `serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `consultation_submission_quizId_createdAt_idx` ON `consultation_submission`(`quizId`, `createdAt`);

-- AddForeignKey
ALTER TABLE `ConsultationQuizNode` ADD CONSTRAINT `ConsultationQuizNode_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `ConsultationQuiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsultationQuizOption` ADD CONSTRAINT `ConsultationQuizOption_nodeId_fkey` FOREIGN KEY (`nodeId`) REFERENCES `ConsultationQuizNode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsultationQuizOption` ADD CONSTRAINT `ConsultationQuizOption_targetNodeId_fkey` FOREIGN KEY (`targetNodeId`) REFERENCES `ConsultationQuizNode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsultationQuizOptionScore` ADD CONSTRAINT `ConsultationQuizOptionScore_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `ConsultationQuizOption`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsultationQuizOptionScore` ADD CONSTRAINT `ConsultationQuizOptionScore_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consultation_submission` ADD CONSTRAINT `consultation_submission_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `ConsultationQuiz`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
