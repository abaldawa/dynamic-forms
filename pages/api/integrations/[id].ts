// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as integrationServicesController from "../../../modules/integration-services/server/controllers";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'DELETE':
      integrationServicesController.deleteIntegrationServiceOfUser(req, res);
      break
    case 'PATCH':
      integrationServicesController.updateIntegrationServiceOfUser(req, res);
      break;
    default:
      res.setHeader('Allow', ['PATCH', 'DELETE'])
      res.status(405).json({message: `Method ${method} Not Allowed`})
  }
}
