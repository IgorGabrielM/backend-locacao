import { Controller, Post, Delete, Body, Get, Param, Patch, HttpCode, UseGuards } from '@nestjs/common';
import { ContratosService } from './contratos.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateSignatureDto, UpdateClosureDto, LinkContratoPaiDto } from './dto/update-signature.dto';
import { LinkEquipamentoDto } from './dto/link-equipamento.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, CurrentToken } from '../auth/current-user.decorator';

@UseGuards(JwtGuard)
@Controller('contratos')
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Post()
  create(
    @Body() dto: CreateContratoDto,
    @CurrentUser() user: any,
    @CurrentToken() token: string,
  ) {
    return this.contratosService.create(dto, user.id, token);
  }

  @Get()
  findAll(@CurrentToken() token: string) {
    return this.contratosService.findAll(token);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentToken() token: string) {
    return this.contratosService.findOne(id, token);
  }

  @Patch(':id/signature')
  updateSignature(
    @Param('id') id: string,
    @Body() dto: UpdateSignatureDto,
    @CurrentToken() token: string,
  ) {
    return this.contratosService.updateSignature(id, dto, token);
  }

  @Post(':id/closure')
  @HttpCode(200)
  updateClosure(
    @Param('id') id: string,
    @Body() dto: UpdateClosureDto,
    @CurrentToken() token: string,
  ) {
    return this.contratosService.closeContract(id, dto.dataEncerramento, token);
  }

  @Patch(':id/parent')
  linkContratoPai(
    @Param('id') id: string,
    @Body() dto: LinkContratoPaiDto,
    @CurrentToken() token: string,
  ) {
    return this.contratosService.linkContratoPai(id, dto.contratoPaiId, token);
  }

  @Post(':id/equipamentos')
  linkEquipamento(
    @Param('id') id: string,
    @Body() dto: LinkEquipamentoDto,
    @CurrentToken() token: string,
  ) {
    return this.contratosService.linkEquipamento(id, dto, token);
  }

  @Delete(':id/equipamentos/:itemId')
  @HttpCode(200)
  unlinkEquipamento(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @CurrentToken() token: string,
  ) {
    return this.contratosService.unlinkEquipamento(id, itemId, token);
  }
}
