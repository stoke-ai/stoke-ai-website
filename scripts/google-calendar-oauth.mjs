#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';

const clientPath = process.argv[2];
if (!clientPath) {
  console.error('Usage: node scripts/google-calendar-oauth.mjs /path/to/oauth-client.json');
  process.exit(1);
}

const absolutePath = path.resolve(clientPath.replace(/^~(?=$|\/|\\)/, process.env.HOME || ''));
const raw = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
const config = raw.web || raw.installed;
if (!config?.client_id || !config?.client_secret) {
  console.error('Could not find web.client_id/client_secret in JSON file.');
  process.exit(1);
}

const redirectUri = 'http://localhost:3000/oauth/google/callback';
const state = crypto.randomBytes(18).toString('hex');
const scope = 'https://www.googleapis.com/auth/calendar';

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', config.client_id);
authUrl.searchParams.set('redirect_uri', redirectUri);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', scope);
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');
authUrl.searchParams.set('state', state);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', redirectUri);
    if (url.pathname !== '/oauth/google/callback') {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    if (url.searchParams.get('state') !== state) {
      res.writeHead(400);
      res.end('State mismatch. Close this tab and rerun the script.');
      return;
    }

    const code = url.searchParams.get('code');
    if (!code) {
      res.writeHead(400);
      res.end(`Missing authorization code: ${url.searchParams.get('error') || 'unknown error'}`);
      return;
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.client_id,
        client_secret: config.client_secret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const token = await tokenResponse.json();
    if (!tokenResponse.ok) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Token exchange failed. Check terminal.');
      console.error(JSON.stringify(token, null, 2));
      server.close();
      return;
    }

    const envBlock = [
      `GOOGLE_CLIENT_ID=${config.client_id}`,
      `GOOGLE_CLIENT_SECRET=${config.client_secret}`,
      `GOOGLE_REFRESH_TOKEN=${token.refresh_token || ''}`,
      `GOOGLE_CALENDAR_ID=automate@stoke-ai.com`,
    ].join('\n');

    const outputPath = path.join(process.cwd(), '.google-calendar-env.local');
    fs.writeFileSync(outputPath, `${envBlock}\n`, { mode: 0o600 });

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Google Calendar connected.</h1><p>You can close this tab and return to Spark.</p>');

    console.log('\n✅ Google Calendar OAuth complete.');
    console.log(`Wrote secrets to: ${outputPath}`);
    console.log('\nAdd these four env vars to Vercel. Do not paste them into chat.');

    server.close();
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end('Unexpected error. Check terminal.');
    server.close();
  }
});

server.listen(3000, () => {
  console.log('Opening Google consent screen...');
  console.log(authUrl.toString());
  execFile('open', [authUrl.toString()]);
});
