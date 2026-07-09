import { getStore } from '@netlify/blobs';

const STORE_NAME = 'salad-box-orders';

export default async (req) => {
  const url = new URL(req.url);
  const key = url.searchParams.get('key');

  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing key' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const store = getStore(STORE_NAME);

  if (req.method === 'GET') {
    const value = await store.get(key);
    if (value == null) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ value }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'PUT') {
    const body = await req.json();
    if (typeof body.value !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing value' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await store.set(key, body.value);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};
