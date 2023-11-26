import { ApiProperty } from "@nestjs/swagger";

export class UpdateParcelamentoDto {
    @ApiProperty({
        example: 3000,
        description: 'valor da parcela'
    })
    valor: number;
}
