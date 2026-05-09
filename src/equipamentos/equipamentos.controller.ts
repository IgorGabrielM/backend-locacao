import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EquipamentosService } from './equipamentos.service';
import { CreateEquipamentoDto, UpdateEquipamentoDto } from './dto/equipamento.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, CurrentToken } from '../auth/current-user.decorator';

@UseGuards(JwtGuard)
@Controller('equipamentos')
export class EquipamentosController {
  constructor(private readonly equipamentosService: EquipamentosService) {}

  @Get()
  findAll(@CurrentToken() token: string, @Query('todos') todos?: string) {
    return this.equipamentosService.findAll(token, todos !== 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentToken() token: string) {
    return this.equipamentosService.findOne(id, token);
  }

  @Post()
  create(
    @Body() dto: CreateEquipamentoDto,
    @CurrentUser() user: any,
    @CurrentToken() token: string,
  ) {
    return this.equipamentosService.create(dto, user.id, token);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEquipamentoDto,
    @CurrentToken() token: string,
  ) {
    return this.equipamentosService.update(id, dto, token);
  }
}