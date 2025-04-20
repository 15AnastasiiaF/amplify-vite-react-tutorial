import { defineFunction, secret } from '@aws-amplify/backend';

export const sayHello = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'say-hello',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts',
  timeoutSeconds: 30,  // Timeout in seconds (defaults to 3)
  environment: {
    NAME: "TestName",
    //API_ENDPOINT: process.env.API_ENDPOINT
    OPENAI_API_KEY: secret('openai_api_key')
  }
});