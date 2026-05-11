import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';
import { LinkEquipamentoDto } from './dto/link-equipamento.dto';

@Injectable()
export class ContratosService {
  constructor(private configService: ConfigService) {}

  private getClient(token: string) {
    return createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );
  }

  async create(dto: CreateContratoDto, userId: string, token: string) {
    const client = this.getClient(token);

    const { data, error } = await client
      .from('contratos')
      .insert([
        {
          user_id: userId,
          nome: dto.nome,
          cpf: dto.cpf,
          rg: dto.rg,
          cidade: dto.cidade,
          endereco: dto.endereco,
          bairro: dto.bairro,
          telefone: dto.telefone,
          email: dto.email,
          data_entrega: dto.dataEntrega,
          status: 'Sem assinatura',
          contrato_pai_id: dto.contratoPaiId ?? null,
        },
      ])
      .select('id, telefone')
      .single();

    if (error) throw error;

    if (dto.equipamentos?.length) {
      const ids = dto.equipamentos.map((e) => e.equipamento_id);

      const { data: equips, error: equipsError } = await client
        .from('equipamentos')
        .select('id, valor_padrao')
        .in('id', ids);

      if (equipsError) throw equipsError;

      const valorMap = new Map(equips.map((e) => [e.id, e.valor_padrao]));

      const links = dto.equipamentos.map((e) => ({
        contrato_id: data.id,
        equipamento_id: e.equipamento_id,
        quantidade: e.quantidade,
        valor_cobrado: valorMap.get(e.equipamento_id) ?? 0,
      }));

      const { error: linkError } = await client
        .from('contrato_equipamentos')
        .insert(links);

      if (linkError) throw linkError;
    }

    return {
      id: data.id,
      message: 'Contrato criado com sucesso!',
      telefone: data.telefone,
    };
  }

  async findAll(token: string) {
    const { data, error } = await this.getClient(token)
      .from('contratos')
      .select(
        '*, contrato_equipamentos(*, equipamentos(id, descricao, valor_padrao)), contratosFilhos:contratos!contrato_pai_id(*, contrato_equipamentos(*, equipamentos(id, descricao, valor_padrao)))',
      )
      .is('contrato_pai_id', null);

    if (error) throw error;
    return data;
  }

  async findOne(id: string, token: string) {
    const { data, error } = await this.getClient(token)
      .from('contratos')
      .select(
        '*, contrato_equipamentos(*, equipamentos(id, descricao, valor_padrao)), sub_contratos:contratos!contrato_pai_id(*, contrato_equipamentos(*, equipamentos(id, descricao, valor_padrao)))',
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateSignature(id: string, dto: UpdateSignatureDto, token: string) {
    const { data, error } = await this.getClient(token)
      .from('contratos')
      .update({ signature: dto.signature, status: 'Em andamento' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { message: 'Assinatura salva com sucesso!', id: data.id };
  }

  async closeContract(id: string, dataEncerramento: string, token: string) {
    const { error } = await this.getClient(token)
      .from('contratos')
      .update({ data_encerramento: dataEncerramento, status: 'Encerrado' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { message: 'Contrato encerrado com sucesso!' };
  }

  async linkEquipamento(
    contratoId: string,
    dto: LinkEquipamentoDto,
    token: string,
  ) {
    const { data, error } = await this.getClient(token)
      .from('contrato_equipamentos')
      .insert([
        {
          contrato_id: contratoId,
          equipamento_id: dto.equipamento_id,
          quantidade: dto.quantidade,
          valor_cobrado: dto.valorCobrado,
        },
      ])
      .select('*, equipamentos(id, descricao, valor_padrao)')
      .single();

    if (error) throw error;
    return data;
  }

  async unlinkEquipamento(contratoId: string, itemId: string, token: string) {
    const { error } = await this.getClient(token)
      .from('contrato_equipamentos')
      .delete()
      .eq('id', itemId)
      .eq('contrato_id', contratoId);

    if (error) throw error;

    return { message: 'Equipamento desvinculado com sucesso!' };
  }
}
