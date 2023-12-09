import {IsNumber, IsString} from "class-validator";

export class PaginationDTO {
    @IsString()
    page: number = 1;
    @IsString()
    pageSize: number = 10;
}