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

const findIntegrationsByUserId = (userId: UserIntegration['userId']): UserIntegration[] => {
  return userIntegrations.filter(integration => integration.userId === userId);
};

const updateIntegration = (updatedIntegration: UserIntegration): UserIntegration | undefined => {
  const integrationToUpdate = userIntegrations.find(integration => integration.id === updatedIntegration.id);
  
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
  findIntegrationsByUserId,
  addIntegration,
  updateIntegration,
  removeIntegration
};