import { mutators } from "@/replicache/mutators";
import { NextApiRequest, NextApiResponse } from "next";
import { handleRequest } from "replicache-nextjs/lib/backend";

// Next.js runs this function server-side when /api/replicache/[anything].ts is
// requested.
//
// We delegate all such requests to replicache-nextjs which implements the
// server-side of our protocol.
//
// The important thing to notice here is that we pass in `mutators` - our map
// of Replicache mutator functions. These same functions are *also* used on the
// client-side (see [id].tsx). The mutators are run on both the client and the
// server as part of the sync protocol. See mutators.ts for more information.

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    await handleRequest(req, res, mutators);
};
