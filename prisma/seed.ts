import { PrismaClient } from '@prisma/client';
import moment = require("moment");

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

async function main() {

    console.log('Seeding...');
    await prisma.carpark.deleteMany({ where: {} })
    await prisma.rate.deleteMany({ where: {} })

    /// --------- Carpark ---------------
    await prisma.carpark.createMany({ data: carparks })
    
    /// --------- Rate ---------------
    await prisma.rate.createMany({ data: rates })

}




main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });