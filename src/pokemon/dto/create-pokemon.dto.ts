import { IsNumber, IsPositive, IsString, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsNumber()
    @IsPositive()
    no: number;


}
