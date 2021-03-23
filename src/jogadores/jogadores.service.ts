import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;

    //const jogadorEncontrado = this.jogadores.find(
    //  (jogador) => jogador.email === email,
    //);

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      this.atualizar(criarJogadorDto);
    } else {
      this.criar(criarJogadorDto);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    //return await this.jogadores;
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com e-mail ${email} nao encontrado`);
    }
    return jogadorEncontrado;
  }

  async deletarJogador(email): Promise<any> {
    return await this.jogadorModel.remove({ email }).exec();
    // const jogadorEncontrado = this.jogadores.find(
    //   (jogador) => jogador.email === email,
    // );
    // this.jogadores = this.jogadores.filter(
    //   (jogador) => jogador.email !== jogadorEncontrado.email,
    // );
  }

  private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);
    return await jogadorCriado.save();

    // const { nome, telefoneCelular, email } = criarJogadorDto;

    // const jogador: Jogador = {
    //   _id: uuidv4(),
    //   nome,
    //   telefoneCelular,
    //   email,
    //   ranking: `A`,
    //   posicaoRanking: 1,
    //   urlFotoJogador: 'www.google.com.br/foto123.js',
    // };
    // this.logger.log(`criajogadorDto: ${JSON.stringify(jogador)}`);
    // this.jogadores.push(jogador);
  }

  private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await this.jogadorModel
      .findOneAndUpdate(
        { email: criarJogadorDto.email },
        { $set: criarJogadorDto },
      )
      .exec();
    // const { nome } = criarJogadorDto;
    // jogadorEncontrado.nome = nome;
  }
}
