import {NextApiRequest, NextApiResponse} from "next";
import {UserIntegration} from "../../../../common/types/user-integration";
import {database} from "../../../../server/database";
import {
  IntegrationServiceToOptions,
  IntegrationServiceToOptionsSchema,
  SupportedIntegrationServices
} from "../../common/types/integration-service-types";

interface SuccessResponse {
  data: UserIntegration | UserIntegration[];
}

interface ErrorResponse {
  message: string;
  errorDetails?: object;
}

const getUserFromAuthHeader = (req: NextApiRequest) => req.headers.authorization?.split(" ")[1];

/**
 * @public
 *
 * Handler for:
 * GET /api/integrations
 */
const getAllConfiguredIntegrationServicesOfUser = (
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) => {
  const userId = getUserFromAuthHeader(req);

  if(!userId || typeof userId !== 'string') {
    return res.status(400).json({message: `'userId' required and must be string`})
  }

  res.status(200).json({data: database.integrations.findIntegrationsByUserId(userId)});
};

/**
 * @public
 *
 * Handler for:
 * POST /api/integrations
 */
const createNewIntegrationServiceForUser = (
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) => {
  // 1. Extract the incoming data
  const { body: newIntegration } = req;
  const userId = getUserFromAuthHeader(req);

  // 2. Validate the received data
  if(!userId || typeof userId !== 'string') {
    return res.status(400).json({message: `'userId' required and must be string`})
  }

  if (!newIntegration || typeof newIntegration !== 'object') {
    return res.status(400).json({message: `'body' is required`});
  }

  const {integrationServiceName, integrationServiceData} = newIntegration as {
    integrationServiceName: SupportedIntegrationServices;
    integrationServiceData: IntegrationServiceToOptions[SupportedIntegrationServices]
  };
  const integrationServiceSchema = IntegrationServiceToOptionsSchema[integrationServiceName];

  if(!integrationServiceSchema) {
    if(!integrationServiceName) {
      return res.status(400).json({message: `'integrationServiceName' is required in request body`});
    }

    return res.status(400).json({message: `Integration service '${integrationServiceName}' is not supported`});
  }

  /**
   * 3. Check if the user is already integrated with the requested integration service.
   *    If yes then respond with error notifying the same.
   */
  const integrationServiceExists = database.integrations.findIntegration({
    integrationServiceName,
    userId
  });

  if(integrationServiceExists) {
    return res.status(409).json({message: `user id: '${userId}' is already integrated with '${integrationServiceName}'`});
  }

  // 4. Validate whether the integration service details are correctly provided
  const result = integrationServiceSchema.safeParse(integrationServiceData);

  if(!result.success) {
    return res.status(400).json({message: `Invalid 'integrationServiceData'`, errorDetails: result.error.format()});
  }

  // 5. As the data is valid add integration in the database
  const createdIntegration = database.integrations.addIntegration({
    userId,
    integrationServiceName,
    integrationServiceData
  });

  // 6. Respond with created integration
  res.status(201).json({data: createdIntegration});
};

/**
 * @public
 *
 * Handler for:
 * PUT /api/integrations/:id
 */
const updateIntegrationServiceOfUser = (
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) => {
  // 1. Extract the incoming data
  const {
    query: { id },
    body,
  } = req;
  const userId = getUserFromAuthHeader(req);

  // 2. Validate the received data
  if(!userId || typeof userId !== 'string') {
    return res.status(400).json({message: `'userId' required and must be string`})
  }

  if(!id || typeof id !== 'string') {
    return res.status(400).json({message: `'id' is required and must be string`})
  }

  // 3. Check if integration service exists for the given user
  const foundIntegrationService = database.integrations.findIntegration({ id, userId});

  if(!foundIntegrationService) {
    return res.status(404).json({message: `For user id = '${userId}', integration id = '${id}' was not found`});
  }

  const {integrationServiceName} = foundIntegrationService;
  const integrationServiceSchema = IntegrationServiceToOptionsSchema[integrationServiceName];
  const updatedIntegrationServiceData = body as IntegrationServiceToOptions[SupportedIntegrationServices];

  if(!integrationServiceSchema) {
    return res.status(400).json({message: `Integration service '${integrationServiceName}' is not supported`});
  }

  // 4. Validate whether the updated integration service details are correctly provided
  const result = integrationServiceSchema.safeParse(updatedIntegrationServiceData);

  if(!result.success) {
    return res.status(400).json({message: "Invalid request", errorDetails: result.error.format()});
  }

  // 3. As the data is valid update integration details in the database
  const updatedIntegration = database.integrations.updateIntegration({
    id,
    userId,
    integrationServiceName,
    integrationServiceData: updatedIntegrationServiceData
  });

  // 4. Respond whether the operation was successful or not
  if(!updatedIntegration) {
    return res.status(404).json({message: `For user id = '${userId}', integration id = '${id}' was not found`});
  }

  // 5. Respond with updated integration
  res.status(200).json({data: updatedIntegration});
};

/**
 * @public
 *
 * Handler for:
 * DELETE /api/integrations/:id
 */
const deleteIntegrationServiceOfUser = (
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) => {
  // 1. Extract the incoming data
  const {
    query: { id }
  } = req;

  const userId = getUserFromAuthHeader(req);

  // 2. Validate the received data
  if(!userId || typeof userId !== 'string') {
    return res.status(400).json({message: `'userId' required and must be string`})
  }

  if(!id || typeof id !== 'string') {
    return res.status(400).json({message: `'id' is required and must be string`})
  }

  // 3. Check and remove provided integration for the userId
  const deletedIntegration = database.integrations.removeIntegration(id, userId);

  // 4. If integration is not found in DB for user id then respond with error
  if(!deletedIntegration) {
    return res.status(404).json({message: `For user id '${userId}', integration '${id}' not found in DB`});
  }

  // 5. Integration successfully removed for the user id
  res.status(200).json({ data: deletedIntegration });
};

export {
  getAllConfiguredIntegrationServicesOfUser,
  createNewIntegrationServiceForUser,
  updateIntegrationServiceOfUser,
  deleteIntegrationServiceOfUser
};