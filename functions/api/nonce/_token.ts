import { createHash } from "crypto";
export async function onRequestGet(ctx) {
  const {
    params: { token },
    env,
  } = ctx;
  const md5 = createHash("md5").update(token).digest("hex");
  await env.METAMASK_KV.put(`nonce:${token}`, md5);

  return new Response(
    JSON.stringify({
      token,
      nonce: md5,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
