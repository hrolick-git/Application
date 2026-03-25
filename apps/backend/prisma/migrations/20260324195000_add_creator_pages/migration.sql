-- CreateTable
CREATE TABLE "CreatorPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "organizerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorPage_slug_key" ON "CreatorPage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorPage_organizerId_key" ON "CreatorPage"("organizerId");

-- AddForeignKey
ALTER TABLE "CreatorPage" ADD CONSTRAINT "CreatorPage_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
