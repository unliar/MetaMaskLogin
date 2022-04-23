export async function onRequestGet(ctx) {
  const {
    params: { token },
    env,
  } = ctx;
  const md5 = crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
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
