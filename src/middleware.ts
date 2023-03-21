import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dashboardMiddleware from './middlewares/dashboard.middleware';

export const middleware = async (req: NextRequest): Promise<NextResponse> => {
	const middlewares = [dashboardMiddleware];

	const middlewareToExec = middlewares.find((middleware) => middleware.match === req.nextUrl.pathname);

	if (middlewareToExec) return middlewareToExec.exec(req);

	return NextResponse.next();
};
