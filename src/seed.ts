import { PrismaClient } from "@prisma/client";
// import { add } from 'date-fns'

// Instantiate Prisma Client
const prisma = new PrismaClient();

async function main() {
    await prisma.record.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.measurment.deleteMany({});
    await prisma.weatherTypes.deleteMany({});
    await prisma.station.deleteMany({});

    // Create Stations
    const manhattan = await prisma.station.create({
        data: {
            name: "Manhattan",
            country: "US",
            state: "New York",
        },
    });

    const brooklyn = await prisma.station.create({
        data: {
            name: "Brooklyn",
            country: "US",
            state: "New York",
        },
    });

    const rain = await prisma.weatherTypes.create({
        data: {
            typeName: "Rain",
        },
    });

    const snow = await prisma.weatherTypes.create({
        data: {
            typeName: "Snow",
        },
    });

    const sun = await prisma.weatherTypes.create({
        data: {
            typeName: "Sun",
        },
    });

    // Create Weather Records
    await prisma.record.createMany({
        data: [
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-01"),
                temperature: 30.0,
                precipitation: 14.6,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-02"),
                temperature: 15,
                precipitation: 0,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-03"),
                temperature: 14.0,
                precipitation: 0,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-04"),
                temperature: 14.5,
                precipitation: 0,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-05"),
                temperature: 16.9,
                precipitation: 0,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-06"),
                temperature: 20,
                precipitation: 0,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-07"),
                temperature: 20.5,
                precipitation: 0,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-08"),
                temperature: 14.7,
                precipitation: 10,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-09"),
                temperature: 15.3,
                precipitation: 16.4,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-10"),
                temperature: 30.0,
                precipitation: 16,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-11"),
                temperature: 16.43,
                precipitation: 8,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-12"),
                temperature: 18.2,
                precipitation: 2,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-13"),
                temperature: 15.34,
                precipitation: 20,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-14"),
                temperature: 21.7,
                precipitation: 16,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-15"),
                temperature: 23.3,
                precipitation: 0.5,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-16"),
                temperature: 21.8,
                precipitation: 12,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-17"),
                temperature: 19,
                precipitation: 8,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-18"),
                temperature: 19.3,
                precipitation: 1,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-19"),
                temperature: 21,
                precipitation: 5,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-20"),
                temperature: 26.5,
                precipitation: 0,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-21"),
                temperature: 26.5,
                precipitation: 0,
            },
            {
                stationId: manhattan.id,
                recordedAt: new Date("2024-01-22"),
                temperature: 27,
                precipitation: 0,
            },
            {
                stationId: brooklyn.id,
                recordedAt: new Date("2024-01-23"),
                temperature: 30.1,
                precipitation: 0,
            },
        ],
    });

    // Create Weather Events
    await prisma.event.create({
        data: {
            stationId: manhattan.id,
            weatherId: snow.id,
            date: new Date("2024-01-01"),
        },
    });

    await prisma.event.create({
        data: {
            stationId: brooklyn.id,
            weatherId: snow.id,
            date: new Date("2024-01-01"),
        },
    });

    // Create measurments
    await prisma.measurment.create({
        data: {
            stationId: manhattan.id,
            measurementType: "Temperature",
        },
    });

    await prisma.measurment.create({
        data: {
            stationId: brooklyn.id,
            measurementType: "Precipitation",
        },
    });

    // Query all stations
    const allStations = await prisma.station.findMany({
        include: {
            measurments: true,
            weatherRecords: true,
        },
    });
    console.dir(allStations, { depth: null });

    // Query unique identifier
    const snowSearch = await prisma.weatherTypes.findUnique({
        where: {
            typeName: "Snow",
        },
    });
    console.dir(snowSearch, { depth: null });

    // Query date range
    const janRecords = await prisma.record.findMany({
        where: {
            recordedAt: {
                gte: new Date("2024-01-01"),
                lt: new Date("2024-02-01"),
            },
            stationId: manhattan.id,
        },
    });
    console.dir(janRecords, { depth: null });

    // Find average of january temperature in manhattan
    const janAvg = await prisma.record.aggregate({
        _avg: {
            temperature: true,
        },
        where: {
            recordedAt: {
                gte: new Date("2024-01-01"),
                lt: new Date("2024-02-01"),
            },
            stationId: manhattan.id,
        },
    });
    console.log("Average January Manhattan Temperature: ", janAvg._avg.temperature);

    // Snow with station
    const snowStation = await prisma.event.findMany({
        where: {
            weatherId: snow.id,
        },
        include: {
            station: true,
        },
    });
    console.log(snowStation);
}

main()
    .catch((e: Error) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
