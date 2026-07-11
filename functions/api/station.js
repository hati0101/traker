// /functions/api/station.js
// SOOP 방송국 정보 프록시 (닉네임, 프로필)

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
      `https://api-channel.sooplive.com/v1.1/channel/${bjid}/station`,
      { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } }
    );

    const data = await resp.json();
    const st = data.station || {};

    return new Response(JSON.stringify({
      userId: st.userId || bjid,
      userNick: st.userNick || bjid,
      profileImage: st.profileImage || '',
      stationName: st.stationName || '',
      fanCount: st.upd?.fanCnt || 0
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
