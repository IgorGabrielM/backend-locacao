import { Controller, Post, Delete, Body, Get, Param, Patch, HttpCode } from '@nestjs/common';
import { ContratosService } from './contratos.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateSignatureDto, UpdateClosureDto } from './dto/update-signature.dto';
import { LinkEquipamentoDto } from './dto/link-equipamento.dto';

@Controller('contratos')
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Post()
  create(@Body() createContratoDto: CreateContratoDto) {
    return this.contratosService.create(createContratoDto);
  }

  @Get()
  findAll() {
    return this.contratosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contratosService.findOne(id);
  }

  @Patch(':id/signature')
  updateSignature(@Param('id') id: string, @Body() dto: UpdateSignatureDto) {
    return this.contratosService.updateSignature(id, dto);
  }

  @Post(':id/closure')
  @HttpCode(200)
  updateClosure(@Param('id') id: string, @Body() dto: UpdateClosureDto) {
    return this.contratosService.closeContract(id, dto.dataEncerramento);
  }

  @Post(':id/equipamentos')
  linkEquipamento(@Param('id') id: string, @Body() dto: LinkEquipamentoDto) {
    return this.contratosService.linkEquipamento(id, dto);
  }

  @Delete(':id/equipamentos/:itemId')
  @HttpCode(200)
  unlinkEquipamento(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.contratosService.unlinkEquipamento(id, itemId);
  }
}
