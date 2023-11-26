import { ApiProperty } from "@nestjs/swagger";

export class UpdateFinanciamentoDto {
    @ApiProperty({
        example: 'GOL 1.6 MSI 8V 2022 FLEX',
        description: 'Item a ser financiado'
    })
    objeto: string;

    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        description: 'Descrição do objeto'
    })
    descricao: string;
}
