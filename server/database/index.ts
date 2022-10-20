import * as users from './users';
import * as integrations from './integrations';

const database = {
  users,
  integrations
} as const;

export {
  database
};