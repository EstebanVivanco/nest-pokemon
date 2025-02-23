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

      if (error.code === 11000) {
        throw new BadRequestException(`Pokemon already exists ${JSON.stringify(error.keyValue)}`);
      }
      console.log('error :>> ', error);
      throw new InternalServerErrorException('Error creating pokemon');
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

    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: numero.toLowerCase()});
    }
  
    if (!pokemon) {
      throw new NotFoundException('Pokemon no encontrado');
    }

    return pokemon;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
