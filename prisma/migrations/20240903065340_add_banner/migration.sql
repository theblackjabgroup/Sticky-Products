-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `isOnline` BOOLEAN NOT NULL DEFAULT false,
    `scope` VARCHAR(191) NULL,
    `expires` DATETIME(3) NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `userId` BIGINT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `accountOwner` BOOLEAN NOT NULL DEFAULT false,
    `locale` VARCHAR(191) NULL,
    `collaborator` BOOLEAN NULL DEFAULT false,
    `emailVerified` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Banner` (
    `id` INTEGER NOT NULL,
    `topValue` VARCHAR(191) NOT NULL,
    `leftValue` VARCHAR(191) NOT NULL,
    `displayPosition` VARCHAR(191) NOT NULL,
    `productHandleStr` VARCHAR(191) NOT NULL,
    `productIdStr` VARCHAR(191) NOT NULL,
    `bgColor` VARCHAR(191) NOT NULL,
    `buColor` VARCHAR(191) NOT NULL,
    `fontColor` VARCHAR(191) NOT NULL,
    `fontSize` INTEGER NOT NULL,
    `recentlyViewed` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`, `shop`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
