/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import AtividadesController from 'App/Controllers/Http/AtividadesController'
Route.get('/', async () => {
  return "campus360"
})

Route.post('/login', async ({request, auth}) => {
  const {email, password} = request.all()
  try {
    const token = await auth.use('api').attempt(email, password)
    return token
  } catch (error) {
    return error
  }
})

Route.post('/logout', async ({ auth, response }) => {
  await auth.use('api').revoke()
  return {
    revoked: true
  }
})


Route.get('/atividades', async (ctx) => {
  return new AtividadesController().index(ctx)
})

Route.post('/atividades/store', async (ctx) => {
  return new AtividadesController().store(ctx)
})
Route.delete('/atividades/destroy/:id', async (ctx) => {
  return new AtividadesController().destroy(ctx)
})
// Route.delete('/atividades/destroy/:id','AtividadesController.destroy')

Route.put('/atividades/update/:id','AtividadesController.update')
