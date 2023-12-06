import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Participacao from './Participacao'
import User from './User'

export default class Atividade extends BaseModel {
  @column()
  public imagemUrl: string

  @column()
  public imagens: string[]

  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'created_by'})
  public createdBy: number

  @column()
  public nome: string

  @column()
  public descricao: string

  @column()
  public data: Date

  @column()
  public local: string

  @column()
  public tipo: string

  @column()
  public livre: boolean

  @column()
  public imagePath: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public participantes: number

  @belongsTo(() => User , {
    foreignKey: 'created_by'
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => Participacao)
  public participacoes: HasMany<typeof Participacao>
}
