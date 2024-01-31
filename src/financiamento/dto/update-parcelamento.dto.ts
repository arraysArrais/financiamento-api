import { ApiProperty } from "@nestjs/swagger";

export class UpdateParcelamentoDto {
    @ApiProperty({
        example: 3000,
        description: 'valor da parcela'
    })
    valor: number;

    @ApiProperty({
        example: "8949461894984AAA",
        description: 'Código de barras da fatura'
    })
    codigo_barras: string;
}
