import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { EquipamentosService } from './equipamentos.service';
import { CreateEquipamentoDto, UpdateEquipamentoDto } from './dto/equipamento.dto';

@Controller('equipamentos')
export class EquipamentosController {
  constructor(private readonly equipamentosService: EquipamentosService) {}

  @Get()
  findAll(@Query('todos') todos?: string) {
    return this.equipamentosService.findAll(todos !== 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipamentosService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateEquipamentoDto) {
    return this.equipamentosService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEquipamentoDto) {
    return this.equipamentosService.update(id, dto);
  }
}
