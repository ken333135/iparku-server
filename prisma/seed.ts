import { PrismaClient } from '@prisma/client';
import * as moment from "moment";
const fs = require('fs');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function main() {

    console.log('Seeding...');

    await prisma.rate.deleteMany({ where: {} })
    await prisma.carpark.deleteMany({ where: {} })
    await prisma.carparkPrivate.deleteMany({ where: {} })
    // await prisma.lots.deleteMany({ where: {} })

    // // --------- Carpark ---------------
    const carparks = []

    await fs.createReadStream('./prisma/URA_Carpark.csv')
    .pipe(csv())
    .on('data', async (row) => {
        row.x_coord = parseFloat(row.x_coord)
        row.y_coord = parseFloat(row.y_coord)
        row.night_parking = row.night_parking === 'YES' ? true : false
        carparks.push(row)
    })
    .on('end', async () => {
        console.log('CSV file successfully processed');
        await prisma.carpark.createMany({ data: carparks })
    });
    
    // // --------- Rate ---------------
    const rates = []

    await fs.createReadStream('./prisma/URA_Pricing.csv')
    .pipe(csv())
    .on('data', async (row) => {

        const data = {
            car_park_no: row.car_park_no,
            weekday_rate: row.weekday_rate,
            sat_rate: row.sat_rate,
            sun_rate: row.sun_rate,
            from: moment.utc(row.From,"HH:mm:ss").set('month',0).set('date',1).toDate(),
            to: moment.utc(row.To,"HH:mm:ss").set('month',0).set('date',1).toDate(),
        }
        rates.push(data)
    })
    .on('end', async () => {
        console.log('CSV file successfully processed');
        await prisma.rate.createMany({ data: rates })
    });

    // // --------- CarparkPrivate ---------------
    const carparkPrivate = []

    await fs.createReadStream('./prisma/Private_Carpark.csv')
    .pipe(csv())
    .on('data', async (row) => {

        const data = {
            name: row.name,
            car_park_no: row.car_park_no,
            address: row.address,
            weekday_before_5: row.weekday_before_5,
            weekday_after_5: row.weekday_after_5,
            sat: row.sat,
            sun: row.sun,
            postal: row.postal,
            x_coord: parseFloat(row.x_coord),
            y_coord: parseFloat(row.y_coord)
        }
        carparkPrivate.push(data)
    })
    .on('end', async () => {
        console.log('CSV file successfully processed');
        await prisma.carparkPrivate.createMany({ data: carparkPrivate })
    });

   
    // // --------- Lots ---------------
    // await prisma.lots.createMany({ data: lots })

     // // --------- Zipcodes ---------------
    //  const zipcodes = []

    //  await fs.createReadStream('./prisma/zipcodes.csv')
    //  .pipe(csv())
    //  .on('data', async (row) => {
    //      zipcodes.push(row)
    //  })
    //  .on('end', async () => {
    //      console.log('CSV file successfully processed');
    //      await prisma.zipcode.createMany({ data: zipcodes })
    //  });

   

}




main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });