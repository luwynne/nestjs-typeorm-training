import{ createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data:never, context: ExecutionContext) => {
        // ExecutionContext handles http, GraphQl, WebSocket and many different sorts of communication protocol
        const request = context.switchToHttp().getRequest();
        return request.currentUser;
    }
)