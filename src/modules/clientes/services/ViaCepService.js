import { HttpError } from '../../../shared/httpError.js'

export class ViaCepService {
  async lookup(input) {
    const digits = String(input || '').replace(/\D/g, '')
    if (digits.length !== 8) throw new HttpError(400, 'CEP inválido. Informe oito dígitos.')
    let response
    try { response = await fetch(`https://viacep.com.br/ws/${digits}/json/`) } catch { throw new HttpError(502, 'Não foi possível consultar o ViaCEP.') }
    if (!response.ok) throw new HttpError(502, 'O ViaCEP não respondeu corretamente.')
    const data = await response.json()
    if (data.erro) throw new HttpError(404, 'CEP não encontrado.')
    return {
      cep: data.cep,
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
    }
  }
}
