type Row = Record<string, unknown>;

interface FakeDb {
  evaluations: Row[];
  agency_settings: Row[];
}

const FAKE_USER_ID = "test-user-id";

export function createFakeSupabaseClient() {
  const db: FakeDb = { evaluations: [], agency_settings: [] };

  function query(table: keyof FakeDb) {
    let mode: "select" | "insert" | "update" | "upsert" | "delete" = "select";
    let insertRows: Row[] = [];
    let updatePatch: Row = {};
    let upsertRow: Row | null = null;
    const filters: ((row: Row) => boolean)[] = [];
    let selectRequested = false;
    let single = false;
    let maybeSingle = false;

    function currentRows(): Row[] {
      return db[table].filter((row) => filters.every((f) => f(row)));
    }

    function execute() {
      if (mode === "insert") {
        const now = new Date().toISOString();
        const inserted = insertRows.map((r) => ({
          user_id: FAKE_USER_ID,
          created_at: now,
          updated_at: now,
          ...r,
        }));
        db[table].push(...inserted);
        if (selectRequested) {
          return { data: single ? (inserted[0] ?? null) : inserted, error: null };
        }
        return { data: null, error: null };
      }
      if (mode === "upsert") {
        const idx = db[table].findIndex((r) => r.user_id === upsertRow!.user_id);
        if (idx >= 0) db[table][idx] = { ...db[table][idx], ...upsertRow };
        else db[table].push({ ...upsertRow });
        return { data: null, error: null };
      }
      if (mode === "update") {
        const matched = currentRows();
        matched.forEach((row) => Object.assign(row, updatePatch));
        if (selectRequested) {
          return { data: single ? (matched[0] ?? null) : matched, error: null };
        }
        return { data: matched, error: null };
      }
      if (mode === "delete") {
        const matched = currentRows();
        db[table] = db[table].filter((row) => !matched.includes(row));
        return { data: matched, error: null };
      }
      const rows = currentRows();
      if (maybeSingle || single) return { data: rows[0] ?? null, error: null };
      return { data: rows, error: null };
    }

    const builder = {
      select() {
        selectRequested = true;
        return builder;
      },
      insert(payload: Row | Row[]) {
        mode = "insert";
        insertRows = Array.isArray(payload) ? payload : [payload];
        return builder;
      },
      update(patch: Row) {
        mode = "update";
        updatePatch = patch;
        return builder;
      },
      upsert(payload: Row) {
        mode = "upsert";
        upsertRow = payload;
        return builder;
      },
      delete() {
        mode = "delete";
        return builder;
      },
      eq(col: string, value: unknown) {
        filters.push((row) => row[col] === value);
        return builder;
      },
      in(col: string, values: unknown[]) {
        filters.push((row) => values.includes(row[col]));
        return builder;
      },
      not(col: string) {
        filters.push((row) => row[col] !== null && row[col] !== undefined);
        return builder;
      },
      order() {
        return builder;
      },
      single() {
        single = true;
        return builder;
      },
      maybeSingle() {
        maybeSingle = true;
        return builder;
      },
      then(
        resolve: (value: { data: unknown; error: null }) => unknown,
        reject?: (reason: unknown) => unknown
      ) {
        return Promise.resolve(execute()).then(resolve, reject);
      },
    };

    return builder;
  }

  return {
    from: (table: keyof FakeDb) => query(table),
    auth: {
      async getUser() {
        return { data: { user: { id: FAKE_USER_ID, email: "test@example.com" } }, error: null };
      },
    },
    reset() {
      db.evaluations = [];
      db.agency_settings = [];
    },
  };
}

export type FakeSupabaseClient = ReturnType<typeof createFakeSupabaseClient>;
