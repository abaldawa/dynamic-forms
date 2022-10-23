import axios from "axios";
import {IntegrationServiceToOptions, SupportedIntegrationServices} from "../../common/types/integration-service-types";
import {UserIntegration} from "../../../../common/types/user-integration";
import {User} from "../../../../common/types/user";

const INTEGRATION_SETTINGS_BASE_URL = '/api/integrations';

const fetchConfiguredIntegrations = async (
  userId: User['id']
) => {
  const response = await axios.get<{data: UserIntegration[]}>(`${INTEGRATION_SETTINGS_BASE_URL}?userId=${userId}`);
  return response.data.data;
};

const createIntegration = async (
  userId: User['id'],
  integrationServiceName: SupportedIntegrationServices,
  integrationServiceData: IntegrationServiceToOptions[SupportedIntegrationServices]
) => {
  await axios.post<{data: UserIntegration}>(`${INTEGRATION_SETTINGS_BASE_URL}?userId=${userId}`, {
    integrationServiceName,
    integrationServiceData
  });
  const response = await axios.get<{data: UserIntegration[]}>(`api/integrations?userId=${userId}`);

  return response.data.data;
};

const updateConfiguredIntegration = async (
  userId: User['id'],
  integrationId: string,
  updatedIntegrationServiceData: IntegrationServiceToOptions[SupportedIntegrationServices]
) => {
  const response = await axios.patch<{data: UserIntegration}>(
    `${INTEGRATION_SETTINGS_BASE_URL}/${integrationId}?userId=${userId}`,
    updatedIntegrationServiceData
  );

  return response.data.data;
};

const deleteConfiguredIntegration = async (
  userId: User['id'],
  integrationToDelete: UserIntegration
) => {
  const response = await axios.delete<{data: UserIntegration}>(`${INTEGRATION_SETTINGS_BASE_URL}/${integrationToDelete.id}?userId=${userId}`);
  return response.data.data;
};

export {
  createIntegration,
  fetchConfiguredIntegrations,
  updateConfiguredIntegration,
  deleteConfiguredIntegration
};