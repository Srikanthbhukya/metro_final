const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const DATA_DIR = path.join(process.env.HOME, "Downloads", "delhi-metro");

function readCSV(filename) {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(path.join(DATA_DIR, filename))
      .pipe(csv())
      .on("data", row => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

function timeToSeconds(time) {
  const [h, m, s] = time.split(":").map(Number);
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

async function main() {
  console.log("Reading Delhi Metro data...");

  const [stops, routes, trips, stopTimes] = await Promise.all([
    readCSV("stops.txt"),
    readCSV("routes.txt"),
    readCSV("trips.txt"),
    readCSV("stop_times.txt"),
  ]);

  const metro = await prisma.metro.upsert({
    where: { name: "Delhi Metro" },
    update: {},
    create: { name: "Delhi Metro", city: "Delhi" },
  });

  const lineMap = new Map();

  for (const route of routes) {
    let line = await prisma.line.findFirst({
      where: {
        metroId: metro.id,
        name: route.route_long_name,
      },
    });

    if (!line) {
      line = await prisma.line.create({
        data: {
          name: route.route_long_name,
          color: route.route_color,
          metroId: metro.id,
        },
      });
    }

    lineMap.set(route.route_id, line.id);
  }

  const stationMap = new Map();

  for (const stop of stops) {
    let station = await prisma.station.findFirst({
      where: { name: stop.stop_name },
    });

    if (!station) {
      station = await prisma.station.create({
        data: { name: stop.stop_name },
      });
    }

    stationMap.set(stop.stop_id, station.id);
  }

  const tripRouteMap = new Map(
    trips.map(t => [t.trip_id, t.route_id])
  );

  const tripStops = new Map();

  for (const row of stopTimes) {
    if (!tripStops.has(row.trip_id)) {
      tripStops.set(row.trip_id, []);
    }
    tripStops.get(row.trip_id).push(row);
  }

  const stationLinePairs = new Set();
  const connectionMap = new Map();

  for (const [tripId, sequence] of tripStops) {
    const lineId = lineMap.get(tripRouteMap.get(tripId));
    if (!lineId) continue;

    sequence.sort(
      (a, b) => Number(a.stop_sequence) - Number(b.stop_sequence)
    );

    for (const row of sequence) {
      const stationId = stationMap.get(row.stop_id);
      if (stationId) {
        stationLinePairs.add(`${stationId}_${lineId}`);
      }
    }

    for (let i = 0; i < sequence.length - 1; i++) {
      const current = sequence[i];
      const next = sequence[i + 1];

      const fromId = stationMap.get(current.stop_id);
      const toId = stationMap.get(next.stop_id);

      if (!fromId || !toId || fromId === toId) continue;

      const seconds =
        timeToSeconds(next.arrival_time) -
        timeToSeconds(current.departure_time);

      if (seconds <= 0) continue;

      const minutes = Math.max(1, Math.round(seconds / 60));

      for (const [from, to] of [
        [fromId, toId],
        [toId, fromId],
      ]) {
        const key = `${from}_${to}_${lineId}`;

        if (!connectionMap.has(key)) {
          connectionMap.set(key, {
            fromStationId: from,
            toStationId: to,
            lineId,
            timeInMinutes: minutes,
          });
        }
      }
    }
  }

  const stationLineData = [...stationLinePairs].map(pair => {
    const [stationId, lineId] = pair.split("_").map(Number);
    return { stationId, lineId };
  });
  
  for (let i = 0; i < stationLineData.length; i += 500) {
    await prisma.stationToLine.createMany({
      data: stationLineData.slice(i, i + 500),
      skipDuplicates: true,
    });
  }

  const connections = [...connectionMap.values()];

  for (let i = 0; i < connections.length; i += 500) {
    await prisma.connection.createMany({
      data: connections.slice(i, i + 500),
      skipDuplicates: true,
    });
  }

  console.log("\nDelhi Metro import completed!");
  console.log("Stations:", stationMap.size);
  console.log("Lines:", lineMap.size);
  console.log("Station-line relationships:", stationLinePairs.size);
  console.log("Connections:", connections.length);
}

main()
  .catch(error => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });