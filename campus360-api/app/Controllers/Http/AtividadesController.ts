import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Atividade from 'App/Models/Atividade'
import Application from '@ioc:Adonis/Core/Application'


export default class AtividadesController {
  public async participar({ params, auth, response }: HttpContextContract) {
    try {
      const isAutenticado = await auth.check();
      console.log('Usuário autenticado:', isAutenticado);
      const atividadeId = Number(params.id)
  
      // Log para verificar ID
      console.log('ID da Atividade:', atividadeId)
  
      
      const atividade = await Atividade.find(atividadeId)
  
      if (!atividade) {
        
        console.log('Atividade não encontrada')
  
        return response.status(404).json({ message: 'Atividade não encontrada' })
      }
  
      // Verifica se o usuário está autenticado
      if (!auth.user || !auth.user.id) {
        // Log 
        console.log('Usuário não autenticado')
  
        throw new Error('Usuário não autenticado')
      }
  
      // verif se o usuário já está participando da atividade
      const usuarioJaParticipa = atividade.participantes && atividade.participantes.includes(auth.user.id)
      if (usuarioJaParticipa) {
        // Log 
        console.log('Usuário já está participando desta atividade')
  
        return response.status(400).json({ message: 'Usuário já está participando desta atividade' })
      }
  
      // Add user à lista de participantes
      atividade.participantes = atividade.participantes || []
      atividade.participantes.push(auth.user.id)
  
      await atividade.save()
  
      // Log para verificar se a participação foi bem-sucedida
      console.log('Usuário agora está participando desta atividade')
  
      return response.status(200).json({ message: 'Você agora está participando desta atividade' })
    } catch (error) {
      // Log erro
      console.error('Erro ao participar da atividade:', error.message)
  
      return response.status(400).json({
        message: 'Erro ao participar da atividade',
        error: error.message
      })
    }
  }
  
 public async index({}: HttpContextContract) {
    const list = await Atividade.all()
    return list
  }

  public async create({}: HttpContextContract) {

  }

  /*
  * @store
  * @summary Cria uma nova atividade
  * @description Cria uma nova atividade
  * @requestBody {"nome": "Atividade 1", "descricao": "Atividade 1", "data": "2021-09-20T17:03:27.484-03:00", "local": "Local 1", "tipo": "Tipo 1", "livre": true}
  */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(["nome", "descricao", "data", "local", "tipo", "livre"])
      console.log('Dados recebidos:', data);

      if (!data.nome || !data.data || !data.local || !data.tipo || !data.livre) {
        throw new Error('Todos os campos (nome, data, local, tipo, livre) são obrigatórios')
      }

      const ativi = await Atividade.create(data)
      
      console.log('Atividade criada:', ativi.toJSON());

      const imagens = request.files('imagem') // Recebe uma lista de imagens

      await Promise.all(imagens.map(async (imagem, index) => {
        const nomeDaImagem = `${new Date().getTime()}_${index}_${imagem.clientName}`
        await imagem.move(Application.tmpPath('uploads'), {
          name: nomeDaImagem
        })

        if (!imagem.fileName) {
          throw new Error(`Erro ao fazer upload da imagem ${index}`)
        }

        ativi.imagens = ativi.imagens || [] // Certifica-se de que existe um array para as URLs
        ativi.imagens.push(`http://localhost:3333/uploads/${nomeDaImagem}`)

        console.log(`Imagem ${index + 1} carregada e URL associada à atividade: http://localhost:3333/uploads/${nomeDaImagem}`);
      }))

      await ativi.save()

      console.log('Atividade salva URL D imagem:', ativi.toJSON());

      return response.status(201).json({
        message: 'Atividade criada com sucesso',
        atividade: ativi
      })
    } catch (error) {
      console.error('Erro ao criar atividade:', error.message);
      return response.status(400).json({
        message: 'Erro ao criar atividade',
        error: error.message
      })
    }
  }

  public async show({params, response}: HttpContextContract) {
    try {
      const atividadeId = Number(params.id)
      const atividade = await Atividade.findOrFail(atividadeId)
        .catch(() => {
          throw new Error('Atividade não encontrada')
        })

      console.log('Atividade encontrada:', atividade.toJSON()); // Log da atividade encontrada

      return atividade
    } catch (error) {
      console.error('Erro ao buscar atividade:', error.message); // Log de erro
      return response.status(400).json({
        message: 'Erro ao buscar atividade',
        error: error.message
      })
    }
  }

  public async edit({}: HttpContextContract) {}

  /*
  * @update
  * @summary Atualiza uma atividade
  * @description Atualiza uma atividade
  * @requestBody {"nome": "Atividade 1", "descricao": "Atividade 1", "data": "2021-09-20T17:03:27.484-03:00", "local": "Local 1", "tipo": "Tipo 1", "livre": true}
  */
  public async update({request, params, response}: HttpContextContract) {
    try {
      const data = request.only(["nome","descricao","data", "local", "tipo","livre"])
      const atividadeId = Number(params.id)
      const atividade = await Atividade.findOrFail(atividadeId)
      .catch(() => {
        throw new Error('Atividade não encontrada')
      })
      atividade.merge(data)
      await atividade.save()
      return atividade
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao atualizar atividade',
        error: error.message
      })
    }
  }

  public async destroy({params, response}: HttpContextContract) {
    try {
      const atividadeId = Number(params.id)
      const atividade = await Atividade.findOrFail(atividadeId)
      .catch(() => {
        throw new Error('Atividade não encontrada')
      })
      await atividade.delete()
      return response.status(200).json({message: 'Atividade deletada com sucesso'})
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao deletar atividade',
        error: error.message
      })
    }
  }

  /*
  * @filtrar
  * @summary Filtra atividades
  * @description Filtra atividades
  * @paramQuery tipo
  * @paramQuery data
  * @paramQuery page
  */
  public async filtrar({ request, response }: HttpContextContract) {
    let {tipo, data, page} = request.qs()
    try {
      const query = Atividade.query()
      if (tipo) query.where('tipo', 'LIKE', `%${tipo}%`)
      if (data) query.where('data', 'LIKE', `%${data}%`)
      if (page) return query.paginate(page, 10)
      return query.exec()
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao filtrar atividades',
        error: error.message,
      })
    }
  }
}

module.exports = AtividadesController
