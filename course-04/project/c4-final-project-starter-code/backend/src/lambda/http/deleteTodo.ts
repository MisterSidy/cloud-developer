import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
// import { getUserId } from '../utils'
import { deleteTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    logger.info("Dans la fonction deleteTodo")
    // TODO: Remove a TODO item by id
    console.log("Processing Event ", event);
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];

    const deleteData = await deleteTodo(todoId, jwtToken);
    
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
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
