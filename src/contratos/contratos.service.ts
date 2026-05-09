import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';
import { LinkEquipamentoDto } from './dto/link-equipamento.dto';

@Injectable()
export class ContratosService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL')!;
    const key = this.configService.get<string>('SUPABASE_KEY')!;
    this.supabase = createClient(url, key);
  }

  async create(createContratoDto: CreateContratoDto) {
    const { data, error } = await this.supabase
      .from('contratos')
      .insert([{
        nome: createContratoDto.nome,
        cpf: createContratoDto.cpf,
        rg: createContratoDto.rg,
        cidade: createContratoDto.cidade,
        endereco: createContratoDto.endereco,
        bairro: createContratoDto.bairro,
        telefone: createContratoDto.telefone,
        email: createContratoDto.email,
        data_entrega: createContratoDto.dataEntrega,
        status: 'Sem assinatura',
      }])
      .select('id, telefone')
      .single();

    if (error) throw error;

    return {
      id: data.id,
      message: 'Contrato criado com sucesso!',
      telefone: data.telefone,
    };
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('contratos')
      .select('*, contrato_equipamentos(*, equipamentos(id, descricao, valor_padrao))');

    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('contratos')
      .select('*, contrato_equipamentos(*, equipamentos(id, descricao, valor_padrao))')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateSignature(id: string, updateSignatureDto: UpdateSignatureDto) {
    const { data, error } = await this.supabase
      .from('contratos')
      .update({
        signature: updateSignatureDto.signature,
        status: 'Em andamento',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar assinatura:', error);
      throw error;
    }

    return {
      message: 'Assinatura salva com sucesso!',
      id: data.id,
    };
  }

  async closeContract(id: string, dataEncerramento: string) {
    const { error } = await this.supabase
      .from('contratos')
      .update({
        data_encerramento: dataEncerramento,
        status: 'Encerrado',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao encerrar contrato:', error);
      throw error;
    }

    return {
      message: 'Contrato encerrado com sucesso!',
    };
  }

  async linkEquipamento(contratoId: string, dto: LinkEquipamentoDto) {
    const { data, error } = await this.supabase
      .from('contrato_equipamentos')
      .insert([{
        contrato_id: contratoId,
        equipamento_id: dto.equipamentoId,
        quantidade: dto.quantidade,
        valor_cobrado: dto.valorCobrado,
      }])
      .select('*, equipamentos(id, descricao, valor_padrao)')
      .single();

    if (error) throw error;
    return data;
  }

  async unlinkEquipamento(contratoId: string, itemId: string) {
    const { error } = await this.supabase
      .from('contrato_equipamentos')
      .delete()
      .eq('id', itemId)
      .eq('contrato_id', contratoId);

    if (error) throw error;

    return { message: 'Equipamento desvinculado com sucesso!' };
  }
}
