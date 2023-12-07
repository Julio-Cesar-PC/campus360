import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Atividade from './Atividade'
import User from './User'

export default class Participacao extends BaseModel {
  @column({ isPrimary: true })
  public atividadeId: number

  @column({ isPrimary: true, columnName: 'participante_id' })
  public userId: number

  @belongsTo(() => Atividade)
  public atividade: BelongsTo<typeof Atividade>

  @belongsTo(() => User)
  public participante: BelongsTo<typeof User>
}
