import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('deleteTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    logger.info("Dans la fonction deleteTodo")
    // TODO: Remove a TODO item by id
    console.log("Processing Event ", event);
    const userId = getUserId(event)
   
    const deleteData = await deleteTodo(todoId, userId);
    
    return {
        statusCode: 200,
        body: deleteData,
    }
}    
)
handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
