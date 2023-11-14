import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe, Res, HttpException, HttpStatus, Req, UseInterceptors, UploadedFile, MaxFileSizeValidator, FileTypeValidator, ParseFilePipe } from '@nestjs/common';
import { FinanciamentoService } from './financiamento.service';
import { CreateFinanciamentoDto } from './dto/create-financiamento.dto';
import { UpdateFinanciamentoDto } from './dto/update-financiamento.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FiltroFinanciamentoDto } from './dto/filtro-finaciamento.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Financiamento')
@Controller('financiamento')
@ApiBearerAuth('JWT-auth') //permite autenticação do controller inteiro na swagger ui
export class FinanciamentoController {
  constructor(
    private readonly financiamentoService: FinanciamentoService,
    ) { }

  @Post()
  create(@Body() createFinanciamentoDto: CreateFinanciamentoDto) {
    return this.financiamentoService.create(createFinanciamentoDto);
  }

  @Get()
  async findAll(@Query(/* new ValidationPipe() */) query: FiltroFinanciamentoDto, @Res() res: Response) {
    try {
      let financiamentos = await this.financiamentoService.findAll(query);
      if (financiamentos.length == 0) {
        res.status(404).send({ error: 'Registro de financiamento não encontrado' })
      }
      else
        res.status(200).send(financiamentos);

    } catch (error) {
      console.log(error)
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financiamentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinanciamentoDto: UpdateFinanciamentoDto) {
    return this.financiamentoService.update(+id, updateFinanciamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financiamentoService.remove(+id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { img_comprovante: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('img_comprovante'))
  @Post('baixa_parcela/:parcela_id')
  async atualizaParcela(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 10000000 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
    fileIsRequired:false
  })) img: Express.Multer.File, @Param('parcela_id') id: number, @Res() res) {
    console.log(img)

    let parcela = await this.financiamentoService.baixaFatura(id, img)
    
    if(parcela){
      res.status(200).send({message:"Parcela "+parcela.id+" atualizada com sucesso." })
    }
  }

  @Get('parcela/:parcela_id')
  async getParcela(@Param('parcela_id') id: number){
    return this.financiamentoService.getFatura(id)
  }
}
