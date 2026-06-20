-- D1 콘솔에서 실행 또는 wrangler d1 execute로 실행
CREATE TABLE IF NOT EXISTS access_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  expires TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 관리자 키 (만료 없음)
INSERT INTO access_keys (key, label, expires, active) VALUES ('260620', '관리자', NULL, 1);

-- 샘플 유저 키
INSERT INTO access_keys (key, label, expires, active) VALUES ('1001', '유저A', '2026-07-31', 1);
INSERT INTO access_keys (key, label, expires, active) VALUES ('1002', '유저B', '2026-07-31', 1);
INSERT INTO access_keys (key, label, expires, active) VALUES ('1003', '유저C', '2026-07-31', 1);
