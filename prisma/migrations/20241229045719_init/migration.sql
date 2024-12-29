-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PHOTO', 'VIDEO', 'AUDIO', 'VOICE', 'DOCUMENT', 'GIFT', 'STICKER', 'ANIMATION', 'VIDEO_NOTE', 'CONTACT', 'LOCATION', 'VENUE', 'POLL', 'DICE', 'GAME', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT,
    "language_code" TEXT NOT NULL,
    "is_premium" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "text" TEXT,
    "type" "FileType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_chat_id_key" ON "User"("chat_id");
