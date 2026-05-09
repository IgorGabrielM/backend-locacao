import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { CreateEquipamentoDto, UpdateEquipamentoDto } from './dto/equipamento.dto';

@Injectable()
export class EquipamentosService {
  constructor(private configService: ConfigService) {}

  private getClient(token: string) {
    return createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );
  }

  async findAll(token: string, apenasAtivos = true) {
    let query = this.getClient(token)
      .from('equipamentos')
      .select('*')
      .order('descricao');

    if (apenasAtivos) query = query.eq('ativo', true);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findOne(id: string, token: string) {
    const { data, error } = await this.getClient(token)
      .from('equipamentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(dto: CreateEquipamentoDto, userId: string, token: string) {
    const { data, error } = await this.getClient(token)
      .from('equipamentos')
      .insert([{ user_id: userId, descricao: dto.descricao, valor_padrao: dto.valorPadrao }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, dto: UpdateEquipamentoDto, token: string) {
    const payload: Record<string, unknown> = {};
    if (dto.descricao !== undefined) payload.descricao = dto.descricao;
    if (dto.valorPadrao !== undefined) payload.valor_padrao = dto.valorPadrao;
    if (dto.ativo !== undefined) payload.ativo = dto.ativo;

    const { data, error } = await this.getClient(token)
      .from('equipamentos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}