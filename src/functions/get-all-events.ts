import { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import { APIGatewayProxyResult } from 'aws-lambda';
import { catchErrors } from 'src/common/error';
import { getAllEvents } from 'src/common/event-repository';
import { createApiResponse } from 'src/common/response-util';

class Lambda implements LambdaInterface {
    @catchErrors
    public async handler(): Promise<APIGatewayProxyResult> {
        const result = await getAllEvents();

        return createApiResponse(200, result);
    }
}

const lambda = new Lambda();
export const handler = lambda.handler.bind(lambda);
