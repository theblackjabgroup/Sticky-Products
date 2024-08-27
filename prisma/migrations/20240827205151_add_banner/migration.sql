-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" DATETIME,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" INTEGER NOT NULL,
    "topValue" TEXT NOT NULL,
    "leftValue" TEXT NOT NULL,
    "displayPosition" TEXT NOT NULL,
    "productHandleStr" TEXT NOT NULL,
    "productIdStr" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL,
    "buColor" TEXT NOT NULL,
    "fontColor" TEXT NOT NULL,
    "fontSize" INTEGER NOT NULL,
    "recentlyViewed" TEXT NOT NULL,
    "shop" TEXT NOT NULL,

    PRIMARY KEY ("id", "shop")
);
