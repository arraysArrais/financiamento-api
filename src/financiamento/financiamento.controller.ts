import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe, Res, HttpException, HttpStatus, Req, UseInterceptors, UploadedFile, MaxFileSizeValidator, FileTypeValidator, ParseFilePipe, Headers } from '@nestjs/common';
import { FinanciamentoService } from './financiamento.service';
import { CreateFinanciamentoDto } from './dto/create-financiamento.dto';
import { UpdateFinanciamentoDto } from './dto/update-financiamento.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FiltroFinanciamentoDto } from './dto/filtro-finaciamento.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateParcelamentoDto } from './dto/update-parcelamento.dto';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('Financiamento')
@Controller('financiamento')
@ApiBearerAuth('JWT-auth') //permite autenticação do controller inteiro na swagger ui
export class FinanciamentoController {
  constructor(
    private readonly financiamentoService: FinanciamentoService,
    private readonly authService: AuthService
    ) { }
  
  //@ApiConsumes('multipart/form-data') 
  @Post()
  @UseInterceptors(FileInterceptor('img_objeto'))
  async create(
    @Headers() headers,
    @Body() createFinanciamentoDto: CreateFinanciamentoDto,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10000000 }), 
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
      ],
      fileIsRequired:false
    })) img: Express.Multer.File
) {
    const [bearer, token] = headers.authorization.split(' ');
    let user = await this.authService.verifyCredential(token);
    return this.financiamentoService.create(createFinanciamentoDto, img, user);
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
  async update(@Param('id') id: number, @Body() updateFinanciamentoDto: UpdateFinanciamentoDto, @Res() res) {
    try{
      let response = await this.financiamentoService.update(id, updateFinanciamentoDto)
      if(response.message){
        res.status(200).send(response)
      }
      else{
        res.status(404).send(response)
      } 
    }catch(error){
      console.log(error)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res) {
    try{
      let response = await this.financiamentoService.remove(id);
      if(response.message){
        res.status(200).send(response)
      }
      else{
        res.status(404).send(response)
      } 
    }catch(error){
      console.log(error)
    }
    
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

  @Get('parcelas/:financiamento_id')
  async findAllParcelas(@Param('financiamento_id') id: number, @Res() res){

    try{
      let parcelas = await this.financiamentoService.findAllParcelas(id)
      if(parcelas.length > 0)
        res.status(200).send(parcelas);
      else
        res.status(404).send({error: "Financiamento não encontrado"})
    }catch(error){
      console.log(error)
    }
  }

  @Get('parcela/comprovante/:parcela_id')
  async getComprovate(@Param('parcela_id') id: number, @Res() res){
    try{
      let base64String = await this.financiamentoService.getComprovante(id)
      res.status(200).send(base64String)
    }catch(error){
      console.log(error)
    }
    return this.financiamentoService.getComprovante(id);
  }

  @Patch('parcela/:parcela_id')
  async updateParcela(@Param('parcela_id') id: number, @Body() updateParcelamentoDto: UpdateParcelamentoDto, @Res() res){
    try{
      let response = await this.financiamentoService.updateParcela(id, updateParcelamentoDto)
      if(response.message){
        res.status(200).send(response)
      }
      else{
        res.status(404).send(response)
      } 
    }catch(error){
      console.log(error)
    }
  }
}
