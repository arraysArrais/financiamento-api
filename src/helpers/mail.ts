import { Parcela } from "src/financiamento/entities/parcelamento.entity"
const dayjs = require('dayjs')

export async function enviaEmail(parcela: Parcela, comprovante: Express.Multer.File) {

    let vencimento = dayjs(parcela.data_vencimento);

    let headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.SENDGRID_API_KEY
    }
    let body = {
        personalizations: [
            {
                to: [
                    {
                        email: parcela.financiamento.responsavel.email
                    }
                ],
                cc: [
                    {
                        email: parcela.financiamento.pagador.email
                    }
                ],
                subject: "FinanceFlow - Pagamento de parcela",
                dynamic_template_data: {
                    resp_name: parcela.financiamento.responsavel.firstname,
                    data_vencimento: vencimento.format('DD/MM/YYYY'),
                    valor: `R$ ${parcela.valor}`,
                    pag_name: parcela.financiamento.pagador.firstname,
                    subject: `Baixa de fatura - ${parcela.financiamento.objeto} - ${vencimento.format('DD/MM/YYYY')}`
                }
            }
        ],
        from: {
            email: process.env.SENDGRID_FROM_MAIL,
            name: "FinanceFlow"
        },
        reply_to: {
            email: process.env.SENDGRID_FROM_MAIL,
            name: "FinanceFlow"
        },
        attachments: [
            {
                content: comprovante.buffer.toString('base64'),
                filename: `${parcela.financiamento.objeto} ${parcela.data_vencimento} Comprovante`,
                type: comprovante.mimetype,
                disposition: "attachment"
            }
        ],
        template_id: process.env.SENDGRID_MAIL_TEMPLATE_ID


    }

    let requestOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    };

    fetch("https://api.sendgrid.com/v3/mail/send", requestOptions)
        .then(response => response.text())
        .then(result => console.log("Email enviado"))
        .catch(error => console.log('error', error));
}