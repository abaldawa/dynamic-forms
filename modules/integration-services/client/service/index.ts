import axios from "axios";
import {IntegrationServiceToOptions, SupportedIntegrationServices} from "../../common/types/integration-service-types";
import {UserIntegration} from "../../../../common/types/user-integration";
import {User} from "../../../../common/types/user";

const INTEGRATION_SETTINGS_BASE_URL = '/api/integrations';

/**
 * @private
 *
 * Simulate logged-in session by setting user ID
 * in the auth header
 *
 * @param userId
 */
const getAuthHeader = (userId: User['id']) => ({
  headers: {
    Authorization: `Bearer ${userId}`
  }
});

const fetchConfiguredIntegrations = async (
  userId: User['id']
) => {
  const response = await axios.get<{data: UserIntegration[]}>(
    `${INTEGRATION_SETTINGS_BASE_URL}`,
    getAuthHeader(userId)
  );
  return response.data.data;
};

const createIntegration = async (
  userId: User['id'],
  integrationServiceName: SupportedIntegrationServices,
  integrationServiceData: IntegrationServiceToOptions[SupportedIntegrationServices]
) => {
  const response = await axios.post<{data: UserIntegration}>(
    `${INTEGRATION_SETTINGS_BASE_URL}`,
    {
      integrationServiceName,
      integrationServiceData
    },
    getAuthHeader(userId)
  );

  return response.data.data;
};

const updateConfiguredIntegration = async (
  userId: User['id'],
  integrationId: string,
  updatedIntegrationServiceData: IntegrationServiceToOptions[SupportedIntegrationServices]
) => {
  const response = await axios.patch<{data: UserIntegration}>(
    `${INTEGRATION_SETTINGS_BASE_URL}/${integrationId}`,
    updatedIntegrationServiceData,
    getAuthHeader(userId)
  );

  return response.data.data;
};

const deleteConfiguredIntegration = async (
  userId: User['id'],
  integrationToDelete: UserIntegration
) => {
  const response = await axios.delete<{data: UserIntegration}>(
    `${INTEGRATION_SETTINGS_BASE_URL}/${integrationToDelete.id}`,
    getAuthHeader(userId)
  );
  return response.data.data;
};

export {
  createIntegration,
  fetchConfiguredIntegrations,
  updateConfiguredIntegration,
  deleteConfiguredIntegration
};