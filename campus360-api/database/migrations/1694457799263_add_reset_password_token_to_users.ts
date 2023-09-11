import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddResetPasswordTokenToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('reset_password_token').nullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('reset_password_token')
    })
  }
}