import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookingDto {
    @IsNotEmpty()
    @IsString()
    customerName: string;

    @IsNotEmpty()
    @IsEmail()
    customerEmail: string;

    @IsNotEmpty()
    @IsNumber()
    customerId: number;

    @IsNotEmpty()
    @IsString()
    date: string;

    @IsNotEmpty()
    @IsString()
    timeSlot: string;

    @IsNotEmpty()
    @IsNumber()
    serviceId: number;
}