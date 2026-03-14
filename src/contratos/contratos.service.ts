import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateContratoDto } from './dto/create-contrato.dto';

@Injectable()
export class ContratosService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL')!;
    const key = this.configService.get<string>('SUPABASE_KEY')!;
    this.supabase = createClient(url, key);
  }

  async create(createContratoDto: CreateContratoDto) {
    const { equipamentos, ...dados } = createContratoDto;
    const contratoParaSalvar = {
      nome: dados.nome,
      cpf: dados.cpf,
      rg: dados.rg,
      cidade: dados.cidade,
      endereco: dados.endereco,
      bairro: dados.bairro,
      telefone: dados.telefone,
      email: dados.email,
      data_locacao: dados.dataLocacao,
      data_entrega: dados.dataEntrega
    };

    const { data: contrato, error: errorContrato } = await this.supabase
      .from('contratos')
      .insert([contratoParaSalvar])
      .select()
      .single();

    if (errorContrato) {
      console.error('Erro ao inserir contrato:', errorContrato);
      throw errorContrato;
    }

    const equipamentosComId = equipamentos.map(item => ({
      contrato_id: contrato.id,
      descricao: item.descricao,
      quantidade: item.quantidade,
      valor: item.valor,
    }));
    const { error: errorEquip } = await this.supabase
      .from('equipamentos')
      .insert(equipamentosComId);
    if (errorEquip) {
      console.error('Erro ao inserir equipamentos:', errorEquip);
      throw errorEquip;
    }
    return {
      message: 'Contrato e equipamentos salvos com sucesso!',
      contratoId: contrato.id,
      customerEmail: contrato.email,
      linkAssinatura: `http://localhost:4200/assinar/${contrato.id}`,
    };
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('contratos')
      .select('*, equipamentos(*)');

    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('contratos')
      .select('*, equipamentos(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}
