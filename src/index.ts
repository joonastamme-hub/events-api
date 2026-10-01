type Env = {
  DB: D1Database;
};

type EventItem = {
  id: number;
  title: string;
  description: string;
  startsAt: string;
  location: string;
  tags: string[];
  url?: string;
  imageUrl?: string;
};

type EventRow = {
  id: number;
  title: string;
  description: string;
  starts_at: string;
  location: string;
  tags: string;
  url: string | null;
  image_url: string | null;
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (data: unknown, status = 200): Response => {
  return Response.json(data, { status, headers: CORS });
};

const error = (message: string, status: number): Response => {
  return json({ error: message }, status);
};

const toImageUrl = (stored: string | null, origin: string): string | undefined => {
  if (!stored) return undefined;
  return stored.startsWith("/") ? `${origin}${stored}` : stored;
};

const toEvent = (row: EventRow, origin: string): EventItem => {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    startsAt: row.starts_at,
    location: row.location,
    tags: JSON.parse(row.tags) as string[],
    url: row.url ?? undefined,
    imageUrl: toImageUrl(row.image_url, origin),
  };
};

type EventWithoutId = Omit<EventItem, "id">;
type ValidationResult =
  | { ok: true; value: EventWithoutId }
  | { ok: false; errors: Record<string, string> };

const validate = (body: unknown): ValidationResult => {
  const errors: Record<string, string> = {};
  const value = body as Record<string, unknown>;

  if (typeof value?.title !== "string" || value.title.trim() === "") {
    errors.title = "Pealkiri on kohustuslik";
  }
  if (
    typeof value?.startsAt !== "string" ||
    Number.isNaN(Date.parse(value.startsAt))
  ) {
    errors.startsAt = "Algusaeg peab olema kehtiv kuupäev";
  }
  if (value?.tags !== undefined && !Array.isArray(value.tags)) {
    errors.tags = "Sildid peavad olema massiiv";
  }
  if (
    typeof value?.imageUrl === "string" &&
    value.imageUrl.trim() !== "" &&
    !/^(https?:\/\/|\/)/.test(value.imageUrl.trim())
  ) {
    errors.imageUrl = "Pildi aadress peab algama http(s):// või /";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      title: (value.title as string).trim(),
      description:
        typeof value.description === "string" ? value.description.trim() : "",
      startsAt: value.startsAt as string,
      location: typeof value.location === "string" ? value.location.trim() : "",
      tags: Array.isArray(value.tags) ? value.tags.map(String) : [],
      url:
        typeof value.url === "string" && value.url.trim() !== ""
          ? value.url.trim()
          : undefined,
      imageUrl:
        typeof value.imageUrl === "string" && value.imageUrl.trim() !== ""
          ? value.imageUrl.trim()
          : undefined,
    },
  };
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const id = parts[2] ? Number(parts[2]) : null;

    if (parts[0] !== "api" || parts[1] !== "events") {
      return error("Tundmatu lõpp-punkt", 404);
    }
    if (parts[2] !== undefined && !Number.isInteger(id)) {
      return error("Vigane id", 400);
    }

    try {
      if (request.method === "GET" && id === null) {
        const { results } = await env.DB.prepare(
          "SELECT * FROM events ORDER BY starts_at ASC",
        ).all<EventRow>();
        return json(results.map((row) => toEvent(row, url.origin)));
      }

      if (request.method === "GET" && id !== null) {
        const row = await env.DB.prepare("SELECT * FROM events WHERE id = ?")
          .bind(id)
          .first<EventRow>();
        return row
          ? json(toEvent(row, url.origin))
          : error("Sündmust ei leitud", 404);
      }

      if (request.method === "POST" && id === null) {
        const parsed = validate(await request.json());
        if (!parsed.ok) return json({ errors: parsed.errors }, 422);

        const event = parsed.value;
        const row = await env.DB.prepare(
          `INSERT INTO events (title, description, starts_at, location, tags, url, image_url)
           VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
        )
          .bind(
            event.title,
            event.description,
            event.startsAt,
            event.location,
            JSON.stringify(event.tags),
            event.url ?? null,
            event.imageUrl ?? null,
          )
          .first<EventRow>();
        return json(toEvent(row!, url.origin), 201);
      }

      if (request.method === "PUT" && id !== null) {
        const parsed = validate(await request.json());
        if (!parsed.ok) return json({ errors: parsed.errors }, 422);

        const event = parsed.value;
        const row = await env.DB.prepare(
          `UPDATE events
              SET title = ?, description = ?, starts_at = ?, location = ?,
                  tags = ?, url = ?, image_url = ?
            WHERE id = ?
        RETURNING *`,
        )
          .bind(
            event.title,
            event.description,
            event.startsAt,
            event.location,
            JSON.stringify(event.tags),
            event.url ?? null,
            event.imageUrl ?? null,
            id,
          )
          .first<EventRow>();
        return row
          ? json(toEvent(row, url.origin))
          : error("Sündmust ei leitud", 404);
      }

      if (request.method === "DELETE" && id !== null) {
        const result = await env.DB.prepare("DELETE FROM events WHERE id = ?")
          .bind(id)
          .run();
        return result.meta.changes > 0
          ? new Response(null, { status: 204, headers: CORS })
          : error("Sündmust ei leitud", 404);
      }

      return error("Meetod ei ole lubatud", 405);
    } catch (caught) {
      console.error(caught);
      return error("Serveris tekkis viga", 500);
    }
  },
} satisfies ExportedHandler<Env>;
