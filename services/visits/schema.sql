-- Counters are maintained by triggers so duplicate/rejected events change nothing.
CREATE TABLE IF NOT EXISTS counter_totals (
  id INTEGER PRIMARY KEY CHECK(id = 1), views INTEGER NOT NULL DEFAULT 0,
  visitors INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO counter_totals(id) VALUES(1);
CREATE TABLE IF NOT EXISTS counter_visitors (
  id TEXT PRIMARY KEY, last_seen INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS counter_events (
  id TEXT PRIMARY KEY, visitor TEXT NOT NULL, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS counter_events_expiry ON counter_events(created_at);
CREATE TRIGGER IF NOT EXISTS counter_new_visitor AFTER INSERT ON counter_visitors BEGIN
  UPDATE counter_totals SET visitors = visitors + 1 WHERE id = 1;
END;
CREATE TRIGGER IF NOT EXISTS counter_new_event AFTER INSERT ON counter_events BEGIN
  INSERT OR IGNORE INTO counter_visitors(id, last_seen) VALUES(NEW.visitor, NEW.created_at);
  UPDATE counter_visitors SET last_seen = NEW.created_at WHERE id = NEW.visitor;
  UPDATE counter_totals SET views = views + 1 WHERE id = 1;
END;
