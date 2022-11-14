import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createTodo } from '../../helpers/todosAcess'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { buildTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'
// import { createTodo } from '../../businessLogic/todos'

const logger = createLogger('createTodo')


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   const newTodo: CreateTodoRequest = JSON.parse(event.body)
   logger.info("Dans la fonction createTodo")
   
    // TODO: Implement creating a new TODO item
    const todo = buildTodo(newTodo, event)
    const createdTodo = await createTodo(todo)

    return {
      statusCode: 201,
      body: JSON.stringify({
        createdTodo
      })
    }
  } 
)

handler.use(
  cors({
    credentials: true
  })
)
