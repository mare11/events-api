import { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import { type APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { catchErrors } from 'src/common/error';
import { deleteEvent } from 'src/common/event-repository';
import { createApiResponse } from 'src/common/response-util';

class Lambda implements LambdaInterface {
    @catchErrors
    public async handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        await deleteEvent(event.pathParameters.id);

        return createApiResponse(204, undefined);
    }
}

const lambda = new Lambda();
export const handler = lambda.handler.bind(lambda);
