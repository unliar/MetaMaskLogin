export async function onRequestGet(ctx) {
  const {
    params: { token },
    env,
  } = ctx;
  try {
    const md5 = await crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(token))
      .then((r) =>
        [...new Uint8Array(r)]
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
      );
    await env.METAMASK_KV.put(`nonce:${token}`, md5, {
      expirationTtl: 60 * 5,
    });

    return new Response(
      JSON.stringify({
        data: {
          token,
          nonce: md5,
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
