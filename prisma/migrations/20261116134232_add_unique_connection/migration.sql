/*
  Warnings:

  - A unique constraint covering the columns `[fromStationId,toStationId,lineId]` on the table `Connection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Connection_fromStationId_toStationId_lineId_key" ON "public"."Connection"("fromStationId", "toStationId", "lineId");
