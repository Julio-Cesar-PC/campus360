import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Atividade extends BaseModel {
  @column()
  public imagemUrl: string

  @column()
  public imagens: string[]

  @column({ isPrimary: true })
  public id: number

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
  public participantes: number[] // Lista de IDs dos usuários que participam da atividade
}
