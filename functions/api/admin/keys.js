// /functions/api/admin/keys.js — 키 관리 CRUD
// 관리자 인증: 요청 헤더 X-Admin-Key에 관리자 비밀번호 필요

const ADMIN_KEY = "260620"; // 관리자 비밀번호

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key" }
  });
}

function checkAdmin(request) {
  const key = request.headers.get("X-Admin-Key") || "";
  return key === ADMIN_KEY;
}

// CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key"
    }
  });
}

// GET — 전체 목록
export async function onRequestGet(context) {
  if (!checkAdmin(context.request)) return json({ error: "인증 실패" }, 401);
  const db = context.env.DB;

  try {
    const { results } = await db.prepare(
      "SELECT id, key, label, expires, active, created_at FROM access_keys ORDER BY id"
    ).all();
    return json({ keys: results });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

// POST — 추가
export async function onRequestPost(context) {
  if (!checkAdmin(context.request)) return json({ error: "인증 실패" }, 401);
  const db = context.env.DB;

  try {
    const body = await context.request.json();
    const { key, label, expires } = body;

    if (!key || !key.trim()) return json({ error: "비밀번호를 입력해주세요." }, 400);

    // 중복 체크
    const exists = await db.prepare("SELECT id FROM access_keys WHERE key = ?").bind(key.trim()).first();
    if (exists) return json({ error: "이미 존재하는 비밀번호입니다." }, 400);

    await db.prepare(
      "INSERT INTO access_keys (key, label, expires, active) VALUES (?, ?, ?, 1)"
    ).bind(key.trim(), (label || "").trim(), expires || null).run();

    return json({ ok: true });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

// PUT — 수정 (활성/비활성, 만료일 변경)
export async function onRequestPut(context) {
  if (!checkAdmin(context.request)) return json({ error: "인증 실패" }, 401);
  const db = context.env.DB;

  try {
    const body = await context.request.json();
    const { id, active, expires, label } = body;

    if (!id) return json({ error: "id 필요" }, 400);

    if (active !== undefined) {
      await db.prepare("UPDATE access_keys SET active = ? WHERE id = ?").bind(active ? 1 : 0, id).run();
    }
    if (expires !== undefined) {
      await db.prepare("UPDATE access_keys SET expires = ? WHERE id = ?").bind(expires || null, id).run();
    }
    if (label !== undefined) {
      await db.prepare("UPDATE access_keys SET label = ? WHERE id = ?").bind(label, id).run();
    }

    return json({ ok: true });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

// DELETE — 삭제
export async function onRequestDelete(context) {
  if (!checkAdmin(context.request)) return json({ error: "인증 실패" }, 401);
  const db = context.env.DB;

  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");
    if (!id) return json({ error: "id 필요" }, 400);

    await db.prepare("DELETE FROM access_keys WHERE id = ?").bind(parseInt(id)).run();
    return json({ ok: true });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
