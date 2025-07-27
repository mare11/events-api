import { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import { type APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { catchErrors } from 'src/common/error';
import { updateEvent } from 'src/common/event-repository';
import { createApiResponse } from 'src/common/response-util';
import { Event } from '../models/event';

class Lambda implements LambdaInterface {
    @catchErrors
    public async handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const eventBody = JSON.parse(event.body) as Event;
        const result = await updateEvent(eventBody);

        return createApiResponse(200, result);
    }
}

const lambda = new Lambda();
export const handler = lambda.handler.bind(lambda);
