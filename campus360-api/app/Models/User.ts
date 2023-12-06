import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, belongsTo, BelongsTo, computed, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Role from 'App/Models/Role'
import Roles from 'App/Enums/Roles'
import Participacao from './Participacao'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public roleId: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null})
  public rememberMeToken: string | null

  @column({ serializeAs: null})
  public resetPasswordToken: string | null

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @computed()
  public get isAdmin () {
    return this.roleId === Roles.ADMIN
  }

  @computed()
  public get isModerator () {
    return this.roleId === Roles.MODERATOR
  }

  @computed()
  public get isUser () {
    return this.roleId === Roles.USER
  }

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Participacao)
  public participacoes: HasMany<typeof Participacao>
}
