import {AddressEntity} from "./address.entity";
import {InstructorAvailabilityEntity} from "./instructor-availability.entity";
import {ReservationEntity} from "./reservation.entity";

export class InstructorEntity {
    id: number;

    title: string;

    firstName: string;

    lastName: string;
    bio?: string;

    email: string;

    gender: string;

    teachingSince: Date;

    availabilities: InstructorAvailabilityEntity[];
    reservations?: ReservationEntity[];

    address: AddressEntity;
}