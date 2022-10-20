import {NextApiRequest, NextApiResponse} from "next";
import {UserIntegration} from "../../../../common/types/user-integration";
import {database} from "../../../../server/database";
import {IntegrationServiceToOptions, SupportedIntegrationServices} from "../../common/types/integration-service-types";

interface SuccessResponse {
  data: UserIntegration | UserIntegration[];
}

interface ErrorResponse {
  message: string;
}

const getAllConfiguredIntegrationServicesOfUser = (
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) => {
  const {userId} = req.query as {userId?: string};

  if(!userId || typeof userId !== 'string') {
    return res.status(400).json({message: `'userId' required and must be string`})
  }

  res.status(200).json({data: database.integrations.findIntegrationsByUserId(userId)});
};

const createNewIntegrationServiceForUser = (
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) => {
  const {
    query: { userId },
    body: newIntegration,
  } = req;

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

  const createdIntegration = database.integrations.addIntegration({
    userId,
    integrationServiceName,
    integrationServiceData
  });

  // Update or create data in your database
  res.status(201).json({data: createdIntegration});
};

const updateIntegrationServiceOfUser = (
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) => {
  const {
    query: { userId, id },
    body,
  } = req;

  if(!userId || typeof userId !== 'string') {
    return res.status(400).json({message: `'userId' required and must be string`})
  }

  if(!id || typeof id !== 'string') {
    return res.status(400).json({message: `'id' is required and must be string`})
  }

  const {integrationServiceName, integrationServiceData} = body as {
    integrationServiceName: SupportedIntegrationServices;
    integrationServiceData: IntegrationServiceToOptions[SupportedIntegrationServices]
  };
  const updatedIntegration = database.integrations.updateIntegration({
    id,
    userId,
    integrationServiceName,
    integrationServiceData
  });

  if(updatedIntegration) {
    return res.status(200).json({data: updatedIntegration});
  }

  res.status(404).json({message: `integration '${id}' not found in DB`});
};

const deleteIntegrationServiceOfUser = (
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) => {
  const {
    query: { userId, id }
  } = req;

  if(!userId || typeof userId !== 'string') {
    return res.status(400).json({message: `'userId' required and must be string`})
  }

  if(!id || typeof id !== 'string') {
    return res.status(400).json({message: `'id' is required and must be string`})
  }

  const deletedIntegration = database.integrations.removeIntegration(id);

  if(deletedIntegration) {
    return res.status(200).json({ data: deletedIntegration });
  }

  res.status(404).json({ message: `integration '${id}' not found in DB` });
};

export {
  getAllConfiguredIntegrationServicesOfUser,
  createNewIntegrationServiceForUser,
  updateIntegrationServiceOfUser,
  deleteIntegrationServiceOfUser
};