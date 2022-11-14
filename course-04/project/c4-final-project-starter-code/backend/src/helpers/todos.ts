// import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { getUserId } from '../lambda/utils'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'
import { TodoUpdate } from '../models/TodoUpdate'
// import * as createError from 'http-errors'


// TODO: Implement businessLogic

export function buildTodo(todoRequest: CreateTodoRequest, event: APIGatewayProxyEvent): TodoItem {

    const todoId = uuid.v4()
    const todo = {
        todoId: todoId,
        createdAt: new Date().toISOString(),
        userId: getUserId(event),
        done: false,
        attachmentUrl: '',
        ...todoRequest
    }
    return todo as TodoItem
}

export function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return updateTodo(updateTodoRequest, todoId, userId);
}

export function deleteTodo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return deleteTodo(todoId, userId);
}

