import {AddressEntity} from "./address.entity";
import {InstructorAvailabilityEntity} from "./instructor-availability.entity";

export class InstructorEntity {
    id: number;

    title: string;

    firstName: string;

    lastName: string;

    email: string;

    gender: string;

    teachingSince: Date;

    availabilities: InstructorAvailabilityEntity[];

    address: AddressEntity;
}