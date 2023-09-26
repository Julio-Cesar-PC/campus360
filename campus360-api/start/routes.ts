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
import AutoSwagger from "adonis-autoswagger";
import swagger from "../config/swagger";

Route.get("/swagger", async () => {
  return AutoSwagger.docs(Route.toJSON(), swagger);
});

Route.get("/docs", async () => {''
  return AutoSwagger.ui("/swagger");
});

Route.get('/', async () => {
  return "campus360"
})

Route.group(() => {
  Route.post('/login', 'AuthController.login')

  Route.post('/register', 'AuthController.register')

  Route.get('/users', 'UsersController.index')

  Route.get('/me', 'UsersController.me').middleware('auth')

  Route.post('/logout', 'AuthController.logout').middleware('auth')

  Route.delete('/users/destroy/:id', 'AuthController.destroy').middleware('auth')

  Route.put('/users/update/:id', 'AuthController.update').middleware('auth')

  Route.post('/forgot-password', 'AuthController.forgotPassword')

  Route.post('/reset-password', 'AuthController.resetPassword')

  Route.post('/atividades/:id/participar', 'AtividadesController.participar').middleware('auth')


})

Route.group(() => {

  Route.get('/', 'AtividadesController.index')

  Route.get('/show/:id', 'AtividadesController.show')

  Route.post('/store', 'AtividadesController.store')

  Route.delete('/destroy/:id', 'AtividadesController.destroy')

  Route.put('/update/:id','AtividadesController.update')

  Route.get('/filtrar', 'AtividadesController.filtrar')

}).prefix('atividades')

Route.get('uploads/:imageName', 'AtividadesController.showImage')
