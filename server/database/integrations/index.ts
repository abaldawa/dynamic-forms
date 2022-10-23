import {UserIntegration} from "../../../common/types/user-integration";
import {getUniqueRandomId} from "../../../common/utils/random";
import {
  SupportedIntegrationServices
} from "../../../modules/integration-services/common/types/integration-service-types";

// In-memory DB
const userIntegrations: UserIntegration[] = [];

const addIntegration = (userIntegration: Omit<UserIntegration, 'id'>): UserIntegration => {
  const id = getUniqueRandomId();
  const newIntegration: UserIntegration = {
    id,
    ...userIntegration
  };

  userIntegrations.push(newIntegration);

  return newIntegration;
};

const removeIntegration = (integrationId: UserIntegration['id']): UserIntegration | undefined => {
  const index = userIntegrations.findIndex(integration => integration.id === integrationId);

  if(index !== -1) {
    const [deletedIntegration] = userIntegrations.splice(index, 1);
    return deletedIntegration;
  }
};

const findIntegration = (
  query: Partial<Omit<UserIntegration, "integrationServiceData">>
): UserIntegration | undefined => {
  const allQueries = Object.entries(query) as Array<
    [queryKey: keyof typeof query, queryValue: typeof query[keyof typeof query]]
  >;

  return userIntegrations.find(
    userIntegration => allQueries.every(
      ([queryKey, queryValue]) => userIntegration[queryKey] === queryValue
    )
  );
};

const findIntegrationsByUserId = (userId: UserIntegration['userId']): UserIntegration[] => {
  return userIntegrations.filter(integration => integration.userId === userId);
};

const updateIntegration = (updatedIntegration: UserIntegration): UserIntegration | undefined => {
  const integrationToUpdate = userIntegrations.find(
    integration => integration.id === updatedIntegration.id && integration.userId === updatedIntegration.userId
  );
  
  if(integrationToUpdate) {
    integrationToUpdate.integrationServiceData = updatedIntegration.integrationServiceData;
    
    return integrationToUpdate;
  }
};

const getSupportedIntegrationServiceNames = (): SupportedIntegrationServices[] => [
  "Zapier",
  "HubSpot",
  "Salesforce"
];

export type {
  UserIntegration
};

export {
  getSupportedIntegrationServiceNames,
  findIntegration,
  findIntegrationsByUserId,
  addIntegration,
  updateIntegration,
  removeIntegration
};