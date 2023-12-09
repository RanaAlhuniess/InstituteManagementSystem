export abstract class ISessionRepository {

    abstract delete(id: number, profileId: number): Promise<void>;
}