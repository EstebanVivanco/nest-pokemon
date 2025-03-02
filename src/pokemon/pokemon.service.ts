import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {


    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {

      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {

      this.handleExceptions(error);
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(numero: string) {

    let pokemon: Pokemon | null = null;

    if (!isNaN(+numero)) {
      pokemon = await this.pokemonModel.findOne({ no: numero });
    }

    if (!pokemon && isValidObjectId(numero)) {
      pokemon = await this.pokemonModel.findById(numero);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: numero.toLowerCase() });
    }

    if (!pokemon) {
      throw new NotFoundException('Pokemon no encontrado');
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    if (!updatePokemonDto) {
      throw new BadRequestException('Update data is required');
    }

    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {

      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {

      this.handleExceptions(error);

    }

  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }


  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon already exists ${JSON.stringify(error.keyValue)}`);
    }
    console.log('error :>> ', error);
    throw new InternalServerErrorException('Error creating pokemon');
  }
}
