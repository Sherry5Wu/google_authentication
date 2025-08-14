require('dotenv').config();
const Fastify = require('fastify');
const cors = require('@fastify/cors');
const { OAuth2Client } = require('google-auth-library');
const { initDB } = require('./db/index');

const PORT = process.env.BACKEND_PORT || 3000;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';

if (!GOOGLE_CLIENT_ID) {
  console.error('ERROR: GOOGLE_CLIENT_ID not set in environment');
  process.exit(1);
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function build() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: (origin, cb) => {
      // allow REST clients or the configured frontend origin
      if (!origin || origin === FRONTEND_ORIGIN) {
        cb(null, true);
        return;
      }
      cb(null, false);
    }
  });

  const { models } = await initDB(process.env.DB_PATH);

  app.post('/auth/google', async (req, reply) => {
    const { id_token } = req.body || {};
    if (!id_token) return reply.status(400).send({ error: 'id_token missing' });

    let ticket;
    try {
      ticket = await client.verifyIdToken({ idToken: id_token, audience: GOOGLE_CLIENT_ID });
    } catch (err) {
      req.log.error(err);
      return reply.status(401).send({ error: 'Invalid ID token' });
    }

    const payload = ticket.getPayload();
    // payload contains: sub (user id), email, email_verified, name, picture, given_name, family_name

    try {
      const [user, created] = await models.User.findOrCreate({
        where: { googleId: payload.sub },
        defaults: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          googleId: payload.sub
        }
      });

      // if user exists but email or name changed, update
      let changed = false;
      if (user.email !== payload.email) { user.email = payload.email; changed = true; }
      if (user.name !== payload.name) { user.name = payload.name; changed = true; }
      if (user.picture !== payload.picture) { user.picture = payload.picture; changed = true; }
      if (changed) await user.save();

      // Return lightweight user object. In a real app you'd create your own session/jwt.
      return reply.send({
        ok: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          googleId: user.googleId,
          created: created
        }
      });
    } catch (err) {
      req.log.error(err);
      return reply.status(500).send({ error: 'Database error' });
    }
  });

  app.get('/', async () => ({ ok: true, msg: 'Google token backend running' }));

  return app;
}

build().then(app => {
  app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
    console.log(`Backend listening on port ${PORT}`);
  }).catch(err => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
}).catch(err => {
  console.error('Failed to build app', err);
  process.exit(1);
});
