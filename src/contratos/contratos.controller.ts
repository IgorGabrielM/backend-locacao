import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { ContratosService } from './contratos.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import {
  UpdateClosureDto,
  UpdateSignatureDto,
} from './dto/update-signature.dto';

@Controller('contratos')
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Post()
  async create(@Body() createContratoDto: CreateContratoDto) {
    return this.contratosService.create(createContratoDto);
  }

  @Get()
  async findAll() {
    return this.contratosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contratosService.findOne(id);
  }

  @Patch(':id/signature')
  async updateSignature(
    @Param('id') id: string,
    @Body() updateSignatureDto: UpdateSignatureDto) {
    return this.contratosService.updateSignature(id, updateSignatureDto);
  }

  @Patch(':id/closure')
  async updateClosure(
    @Param('id') id: string,
    @Body() updateSignatureDto: UpdateClosureDto) {
    return this.contratosService.updateClosure(id, updateSignatureDto);
  }
}
