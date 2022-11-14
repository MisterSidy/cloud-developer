import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)
const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX


const docClient: DocumentClient = createDynamoDBClient()
//TODO: Implement the dataLayer logic

export async function createTodo(todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todosTable,
      Item: todo
    }).promise()

    return todo
}

export async function getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
    const result = await docClient.query({
        TableName : todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()
    return result.Items as TodoItem[]
}
export async function getTodoById(todoId: string): Promise<TodoItem> {
    const result = await docClient.query({
        TableName: todosTable,
        IndexName: index,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
            ':todoId': todoId
        }
    }).promise()

    const items = result.Items

    if (items.length !==0) return result.Items[0] as TodoItem
    return null
}
export async function updateTodo(todo: TodoItem): Promise<TodoItem> {
    console.log('updating.........')
    const data = await docClient
      .update({
        TableName: todosTable,
        Key: {
          todoId: todo.todoId,
          userId: todo.userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': todo.attachmentUrl
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()
    console.log('updated after one')
    return data.Attributes as TodoItem
  }

export async function deleteTodoItem(todoId: string, userId: string): Promise<string> {
    console.log("Deleting todo");

    const params = {
        TableName: todosTable,
        Key: {
            todoId,
            userId
        },
    };

    const result = await docClient.delete(params).promise();
    console.log(result);

    return todoId as string;
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
    return new XAWS.DynamoDB.DocumentClient()
  }