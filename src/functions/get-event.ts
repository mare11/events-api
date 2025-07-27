import { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import { type APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { catchErrors } from 'src/common/error';
import { getEvent } from 'src/common/event-repository';
import { createApiResponse } from 'src/common/response-util';

class Lambda implements LambdaInterface {
    @catchErrors
    public async handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const result = await getEvent(event.pathParameters.id);

        return createApiResponse(200, result);
    }
}

const lambda = new Lambda();
export const handler = lambda.handler.bind(lambda);
