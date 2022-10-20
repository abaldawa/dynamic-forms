import {User} from "./user";
import {
  IntegrationServiceToOptions,
  SupportedIntegrationServices
} from "../../modules/integration-services/common/types/integration-service-types";

interface UserIntegration {
  id: string;
  userId: User['id'];
  integrationServiceName: SupportedIntegrationServices;
  integrationServiceData: IntegrationServiceToOptions[SupportedIntegrationServices]
}

export type {
  UserIntegration
};