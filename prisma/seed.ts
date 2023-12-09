import {PrismaClient} from '@prisma/client'
import * as argon from "argon2";

const prisma = new PrismaClient()


async function createAddress() {
    return prisma.address.create({
        data: {
            street: '123 Main St',
            city: 'City',
            country: 'Country',
        },
    });
}

async function createInstructors(addressId: number) {
    const instructor1Availabilities = {
        timeFrom: new Date(new Date().setHours(11, 0, 0, 0)), // 11:00 AM
        timeTo: new Date(new Date().setHours(21, 0, 0, 0)), // 9:00 PM
    };

    const instructor2Availabilities = {
        timeFrom: new Date(new Date().setHours(16, 0, 0, 0)), // 11:00 AM
        timeTo: new Date(new Date().setHours(21, 0, 0, 0)), // 9:00 PM
    };
    const instructor3Availabilities = {
        timeFrom: new Date(new Date().setHours(17, 0, 0, 0)), // 11:00 AM
        timeTo: new Date(new Date().setHours(23, 0, 0, 0)), // 9:00 PM
    };
    await prisma.$transaction([
        prisma.user.create({
            data: {
                email: 'user1@example.com',
                password: await argon.hash('password1'),
                roleId: 2,
                instructor: {
                    create: {
                        title: 'Dr.',
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john@example.com',
                        gender: 'MALE',
                        bio: 'Experienced instructor',
                        teachingSince: new Date(),
                        addressId: addressId,
                        availabilities: {
                            create: [
                                {
                                    dayOfWeek: 'SAT',
                                    timeFrom: instructor1Availabilities.timeFrom,
                                    timeTo: instructor1Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },
                                {
                                    dayOfWeek: 'SUN',
                                    timeFrom: instructor1Availabilities.timeFrom,
                                    timeTo: instructor1Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },
                                {
                                    dayOfWeek: 'MON',
                                    timeFrom: instructor1Availabilities.timeFrom,
                                    timeTo: instructor1Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },
                                {
                                    dayOfWeek: 'TUE',
                                    timeFrom: instructor1Availabilities.timeFrom,
                                    timeTo: instructor1Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },
                                {
                                    dayOfWeek: 'WED',
                                    timeFrom: instructor1Availabilities.timeFrom,
                                    timeTo: instructor1Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },
                                {
                                    dayOfWeek: 'THU',
                                    timeFrom: instructor1Availabilities.timeFrom,
                                    timeTo: instructor1Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },

                            ],
                        },
                    },
                },
            },
        }),
        prisma.user.create({
            data: {
                email: 'user2@example.com',
                password: await argon.hash('password1'),
                roleId: 2,
                instructor: {
                    create: {
                        title: 'Prof.',
                        firstName: 'Jane',
                        lastName: 'Smith',
                        email: 'jane@example.com',
                        gender: 'FEMALE',
                        bio: 'Passionate about teaching',
                        teachingSince: new Date(),
                        addressId: addressId,
                        availabilities: {
                            create: [
                                {
                                    dayOfWeek: 'SAT',
                                    timeFrom: instructor2Availabilities.timeFrom,
                                    timeTo: instructor2Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },
                                {
                                    dayOfWeek: 'SUN',
                                    timeFrom: instructor2Availabilities.timeFrom,
                                    timeTo: instructor2Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },
                                {
                                    dayOfWeek: 'MON',
                                    timeFrom: instructor2Availabilities.timeFrom,
                                    timeTo: instructor2Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },
                                {
                                    dayOfWeek: 'TUE',
                                    timeFrom: instructor2Availabilities.timeFrom,
                                    timeTo: instructor2Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },
                                {
                                    dayOfWeek: 'WED',
                                    timeFrom: instructor2Availabilities.timeFrom,
                                    timeTo: instructor2Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },
                                {
                                    dayOfWeek: 'THU',
                                    timeFrom: instructor2Availabilities.timeFrom,
                                    timeTo: instructor2Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },

                            ],
                        },
                    },
                },
            },
        }),
        prisma.user.create({
            data: {
                email: 'user3@example.com',
                password: await argon.hash('password3'),
                roleId: 2,
                instructor: {
                    create: {
                        title: 'Prof.',
                        firstName: 'Jane3',
                        lastName: 'Smith',
                        email: 'jane3@example.com',
                        gender: 'FEMALE',
                        bio: 'Passionate about teaching',
                        teachingSince: new Date(),
                        addressId: addressId,
                        availabilities: {
                            create: [
                                {
                                    dayOfWeek: 'SAT',
                                    timeFrom: new Date(new Date().setHours(10, 0, 0, 0)), // 11:00 AM
                                    timeTo: new Date(new Date().setHours(20, 0, 0, 0)), // 9:00 PM
                                    activeFrom: new Date(),
                                },
                                {
                                    dayOfWeek: 'MON',
                                    timeFrom: instructor3Availabilities.timeFrom,
                                    timeTo: instructor3Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },
                                {
                                    dayOfWeek: 'TUE',
                                    timeFrom: instructor3Availabilities.timeFrom,
                                    timeTo: instructor3Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },
                                {
                                    dayOfWeek: 'WED',
                                    timeFrom: instructor3Availabilities.timeFrom,
                                    timeTo: instructor3Availabilities.timeTo,
                                    activeFrom: new Date(),
                                },

                            ],
                        },
                    },
                },
            },
        }),
    ]);
}

function instructor1Availabilities() {
    const instructor1Availabilities = {
        timeFrom: new Date(new Date().setHours(11, 0, 0, 0)), // 11:00 AM
        timeTo: new Date(new Date().setHours(21, 0, 0, 0)), // 9:00 PM
    };
}

async function main() {
    const address = await createAddress();
    const users = await createInstructors(address.id)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })