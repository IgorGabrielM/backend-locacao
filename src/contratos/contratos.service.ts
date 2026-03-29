import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';

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
      data_entrega: dados.dataEntrega,
    };

    const { data: contrato, error: errorContrato } = await this.supabase
      .from('contratos')
      .insert([contratoParaSalvar])
      .select('id, telefone')
      .single();

    if (errorContrato) throw errorContrato;

    const equipamentosParaSalvar = equipamentos.map((item) => ({
      contrato_id: contrato.id,
      descricao: item.descricao,
      quantidade: item.quantidade,
      valor: item.valor,
    }));

    const { error: errorEquipamentos } = await this.supabase
      .from('equipamentos')
      .insert(equipamentosParaSalvar);

    if (errorEquipamentos) {
      await this.supabase.from('contratos').delete().eq('id', contrato.id);
      throw errorEquipamentos;
    }

    return {
      id: contrato.id,
      message: 'Contrato criado com sucesso!',
      telefone: contrato.telefone,
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

  async updateSignature(id: string, updateSignatureDto: UpdateSignatureDto) {
    const { data, error } = await this.supabase
      .from('contratos')
      .update({ signature: updateSignatureDto.signature })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar assinatura:', error);
      throw error;
    }

    return {
      message: 'Assinatura salva com sucesso!',
      id: data.id
    };
  }
}
