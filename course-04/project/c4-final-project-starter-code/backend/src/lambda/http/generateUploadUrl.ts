import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getTodoById, updateTodo } from '../../helpers/todosAcess'
import { getUploadUrl } from '../../helpers/attachmentUtils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

const bucketname = process.env.ATTACHMENT_S3_BUCKET

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const todo = await getTodoById(todoId)
    todo.attachmentUrl = `https://${bucketname}.s3.amazonaws.com/${todoId}`
    logger.info("Dans la fonction generateUploadUrl")
    console.log(todo)


    await updateTodo(todo);
    console.log("Uploaded......")
    const url = await getUploadUrl(todoId)
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id   
    return {
        statusCode: 202,
        body: JSON.stringify({
          uploadUrl: url
        })
      }
  }
)

handler.use(httpErrorHandler()).use(
    cors({
      credentials: true
    })
  )