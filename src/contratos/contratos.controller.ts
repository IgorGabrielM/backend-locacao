import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ContratosService } from './contratos.service';
import { CreateContratoDto } from './dto/create-contrato.dto';

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
}
