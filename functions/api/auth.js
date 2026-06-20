// /functions/api/auth.js — D1 기반 인증

export async function onRequestPost(context) {
  const db = context.env.DB;

  try {
    const body = await context.request.json();
    const inputKey = (body.key || "").trim();

    if (!inputKey) {
      return json({ ok: false, message: "비밀번호를 입력해주세요." });
    }

    const row = await db.prepare(
      "SELECT key, label, expires, active FROM access_keys WHERE key = ?"
    ).bind(inputKey).first();

    if (!row) {
      return json({ ok: false, message: "비밀번호가 틀렸습니다." });
    }

    if (!row.active) {
      return json({ ok: false, message: "비활성화된 비밀번호입니다." });
    }

    if (row.expires) {
      const expDate = new Date(row.expires + "T23:59:59");
      if (new Date() > expDate) {
        return json({ ok: false, message: "만료된 비밀번호입니다." });
      }
    }

    return json({ ok: true, label: row.label });
  } catch (e) {
    return json({ ok: false, message: "서버 오류: " + e.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}
