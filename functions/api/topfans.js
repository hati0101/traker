// /functions/api/topfans.js
// SOOP 열혈팬 TOP20 목록 프록시

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const bjid = url.searchParams.get('bjid');

  if (!bjid) {
    return new Response(JSON.stringify({ error: 'bjid required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    const resp = await fetch(
      `https://api-channel.sooplive.com/v1.1/channel/${bjid}/topfans/detail`,
      { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } }
    );

    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
