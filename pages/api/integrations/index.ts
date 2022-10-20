import type { NextApiRequest, NextApiResponse } from "next";
import * as integrationServicesController from "../../../modules/integration-services/server/controllers";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      integrationServicesController.getAllConfiguredIntegrationServicesOfUser(req, res);
      break
    case 'POST': {
      integrationServicesController.createNewIntegrationServiceForUser(req, res);
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
