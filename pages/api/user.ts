// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {User} from "../../common/types/user";
import {database} from "../../server/database";


export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<User>
) {
  res.status(200).json(database.users.getUser());
}
