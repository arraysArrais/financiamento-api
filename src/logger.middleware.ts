import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    //response log
    const rawResponse = res.write;
    const rawResponseEnd = res.end; const chunkBuffers = [];
    res.write = (...chunks) => {
      const resArgs = [];
      for (let i = 0; i < chunks.length; i++) {
        resArgs[i] = chunks[i]; if (!resArgs[i]) {
          res.once('drain', res.write);
          i--;
        }
      } if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      } return rawResponse.apply(res, resArgs);
    };
    res.end = (...chunk) => {
      const resArgs = [];
      for (let i = 0; i < chunk.length; i++) {
        resArgs[i] = chunk[i];
      } if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }
      const body = Buffer.concat(chunkBuffers).toString('utf8'); res.setHeader('origin', 'restjs-req-res-logging-repo');

      function isJson(item) {
        let value = typeof item !== "string" ? JSON.stringify(item) : item;
        try {
          value = JSON.parse(value);
        } catch (e) {
          return false;
        }

        return typeof value === "object" && value !== null;
      }

      const responseLog = {
        response: {
          statusCode: res.statusCode,
          body: (isJson(body)) ? JSON.parse(body) : body,
          // Returns a shallow copy of the current outgoing headers
          headers: res.getHeaders(),
        },
      }; console.log('res: ', responseLog); rawResponseEnd.apply(res, resArgs);
      return responseLog as unknown as Response;
    };

    // Gets the request log
    console.log(`req:`, {
      headers: req.headers,
      body: req.body,
      originalUrl: req.originalUrl,
      method: req.method,
    });    // Ends middleware function execution, hence allowing to move on 
    if (next) {
      next();
    }
  }
}