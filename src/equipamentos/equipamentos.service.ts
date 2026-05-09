import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateEquipamentoDto, UpdateEquipamentoDto } from './dto/equipamento.dto';

@Injectable()
export class EquipamentosService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL')!;
    const key = this.configService.get<string>('SUPABASE_KEY')!;
    this.supabase = createClient(url, key);
  }

  async findAll(apenasAtivos = true) {
    let query = this.supabase.from('equipamentos').select('*').order('descricao');
    if (apenasAtivos) query = query.eq('ativo', true);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('equipamentos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(dto: CreateEquipamentoDto) {
    const { data, error } = await this.supabase
      .from('equipamentos')
      .insert([{ descricao: dto.descricao, valor_padrao: dto.valorPadrao }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, dto: UpdateEquipamentoDto) {
    const payload: Record<string, unknown> = {};
    if (dto.descricao !== undefined) payload.descricao = dto.descricao;
    if (dto.valorPadrao !== undefined) payload.valor_padrao = dto.valorPadrao;
    if (dto.ativo !== undefined) payload.ativo = dto.ativo;

    const { data, error } = await this.supabase
      .from('equipamentos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
