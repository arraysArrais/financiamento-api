import { IncludeOptions } from 'sequelize';
import { FiltroFinanciamentoDto } from '../dto/filtro-finaciamento.dto';

export function defaultScope(queryParams?: FiltroFinanciamentoDto): IncludeOptions {

  console.log("query params hein barao NO SCOPO VIU", queryParams)
  return {
      include: [
        {
          association: 'parcelas',
          attributes:['id', 'status', 'data_vencimento', 'valor'],
          required: true,
        },
      ],
      order: [
        ['parcelas', 'data_vencimento', 'ASC'],
      ],
      where: {
        ...queryParams
      }
  };
}
