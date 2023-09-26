import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Participacao extends BaseModel {
  @column({ isPrimary: true })
  public atividadeId: number

  @column({ isPrimary: true })
  public participanteId: number
}
