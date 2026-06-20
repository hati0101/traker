// /functions/api/broadcasts.js
// Cloudflare Pages Function: SOOP 방송 목록 API 프록시

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const page = url.searchParams.get('page') || '1';

  const apiUrl = `https://live.sooplive.com/api/main_broad_list_api.php?selectType=action&selectValue=all&orderType=view_cnt&pageNo=${page}&lang=ko_KR`;

  try {
    const resp = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.sooplive.com/',
        'Origin': 'https://www.sooplive.com'
      }
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
