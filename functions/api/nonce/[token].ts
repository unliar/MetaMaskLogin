export async function onRequestGet(ctx) {
  const {
    params: { token },
    env,
  } = ctx;
  try {
    const md5 = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(token)
    );
    await env.METAMASK_KV.put(`nonce:${token}`, new Uint8Array(md5));

    return new Response(
      JSON.stringify({
        data: {
          token,
          nonce: new Uint8Array(md5),
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        code: 500,
        message: error.message,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
