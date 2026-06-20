// /functions/api/detail.js
// Cloudflare Pages Function: SOOP 방송 상세 API 프록시

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const bjid = url.searchParams.get('bjid');

  if (!bjid) {
    return new Response(JSON.stringify({ error: 'bjid required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  const apiUrl = `https://live.sooplive.co.kr/afreeca/player_live_api.php?bjid=${bjid}`;

  try {
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://play.sooplive.co.kr',
        'Origin': 'https://play.sooplive.co.kr',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        bid: bjid, type: 'live', pwd: '', player_type: 'html5',
        stream_type: 'common', quality: 'HD', mode: 'landing',
        from_api: '0', is_revive: 'false'
      })
    });

    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
