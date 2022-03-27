import { PrismaClient } from '@prisma/client';
import * as moment from "moment";
const fs = require('fs');
const csv = require('csv-parser');

const prisma = new PrismaClient();

const carparks = [{
    car_park_no: 'ACB',
    address: 'Blk 270/271 Albert Centre Basement Carpark',
    x_coord: 3014.7936,
    y_coord: 31490.4942,
    car_park_type: 'BASEMENT_CAR_PARK',
    type_of_parking_system: 'ELECTRONIC CARPARK',
    short_term_parking: 'WHOLE DAY',
    free_parking: false,
    night_parking: false,
    car_park_decks: 1,
    gantry_height: 1.8,
    car_park_basement: true,
    central: true
}, {
    car_park_no: 'RIV',
    address: 'Blk 517 Rivervale Crescent Carpark',
    x_coord: 3000.7936,
    y_coord: 31922.4942,
    car_park_type: 'MULTI_STOREY_CARPARK',
    type_of_parking_system: 'ELECTRONIC CARPARK',
    short_term_parking: 'WHOLE DAY',
    free_parking: false,
    night_parking: false,
    car_park_decks: 6,
    gantry_height: 1.7,
    car_park_basement: false,
    central: false
}]


const rates = [{
    car_park_no: 'ACB',
    pricing: 0.6,
    from: moment('17:01', "HH:mm").toDate(),
    to: moment('06:59', "HH:mm").toDate(),
}, {
    car_park_no: 'ACB',
    pricing: 1.2,
    from: moment('07:00', "HH:mm").toDate(),
    to: moment('17:00', "HH:mm").toDate(),
}, {
    car_park_no: 'RIV',
    pricing: 0.45,
    from: moment('19:01', "HH:mm").toDate(),
    to: moment('06:59', "HH:mm").toDate(),
}, {
    car_park_no: 'RIV',
    pricing: 1,
    from: moment('07:00', "HH:mm").toDate(),
    to: moment('19:00', "HH:mm").toDate(),
}]

const lots = [{
    car_park_no: 'ACB',
    total_lots: 50,
    lot_type: 'C',
    lots_available: 37,
    update_datetime: new Date()
}]

async function main() {

    console.log('Seeding...');

    // await prisma.rate.deleteMany({ where: {} })
    // await prisma.carpark.deleteMany({ where: {} })
    // await prisma.lots.deleteMany({ where: {} })

    // // --------- Carpark ---------------
    // await prisma.carpark.createMany({ data: carparks })
    // const carparks = []

    // await fs.createReadStream('./prisma/HDB_Carpark.csv')
    // .pipe(csv())
    // .on('data', async (row) => {
    //     row.x_coord = parseFloat(row.x_coord)
    //     row.y_coord = parseFloat(row.y_coord)
    //     row.night_parking = row.night_parking === 'YES' ? true : false
    //     carparks.push(row)
    // })
    // .on('end', async () => {
    //     console.log('CSV file successfully processed');
    //     await prisma.carpark.createMany({ data: carparks })
    // });
    
    // // --------- Rate ---------------
    // await prisma.rate.createMany({ data: rates })

    // const rates = []

    // await fs.createReadStream('./prisma/rates.csv')
    // .pipe(csv())
    // .on('data', async (row) => {

    //     const data = {
    //         car_park_no: row.car_park_no,
    //         pricing: parseFloat(row.Pricing),
    //         // from: moment(row.From,"HH:mm:ss").set('month',1).set('date',1).format("YYYY-MM-DD HH:mm"),
    //         // to: moment(row.To,"HH:mm:ss").set('month',1).set('date',1).format("YYYY-MM-DD HH:mm"),
    //         from: moment.utc(row.From,"HH:mm:ss").set('month',0).set('date',1).toDate(),
    //         to: moment.utc(row.To,"HH:mm:ss").set('month',0).set('date',1).toDate(),
    //     }
    //     rates.push(data)
    // })
    // .on('end', async () => {
    //     console.log('CSV file successfully processed');
    //     await prisma.rate.createMany({ data: rates })
    // });

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