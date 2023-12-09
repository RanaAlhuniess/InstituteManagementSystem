export class SessionEntity {
    id: number;
    from: string;
    to: string;
    instructor: {
        firstName: string;
        lastName: string;
    };
}