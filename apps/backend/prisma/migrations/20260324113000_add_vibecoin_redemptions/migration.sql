-- CreateTable
CREATE TABLE "VibecoinRedemption" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VibecoinRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VibecoinRedemption_userId_code_key" ON "VibecoinRedemption"("userId", "code");

-- AddForeignKey
ALTER TABLE "VibecoinRedemption" ADD CONSTRAINT "VibecoinRedemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
