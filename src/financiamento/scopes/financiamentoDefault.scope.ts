import { IncludeOptions } from 'sequelize';
import { FiltroFinanciamentoDto } from '../dto/filtro-finaciamento.dto';

export function defaultScope(queryParams?: FiltroFinanciamentoDto): IncludeOptions {
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
      },
  };
}
