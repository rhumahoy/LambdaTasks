import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import qs from "node:querystring";
import axios from "axios";
import open from "open";

const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const CREDS = JSON.parse(await readFile(CREDENTIALS_PATH)).web;
const BASE_URL = "https://www.googleapis.com/drive/v3";

const TOKEN_PATH = path.join(process.cwd(), "token.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

export default {
  hasToken() {
    return !this.token || !this.token.access_token || !this.token.refresh_token;
  },
  setToken(token) {
    this.token = token;
  },
  async auth() {
    try {
      const tokenFile = await readFile(TOKEN_PATH);
      this.token = JSON.parse(tokenFile);

      await axios.get(`${BASE_URL}/about`, {
        headers: {
          Authorization: `Bearer ${this.token.access_token}`,
        },
        params: {
          fields: "kind",
        },
      });
    } catch (e) {
      if (e.code === "ENOENT") {
        //

        return new Promise((res, rej) => {
          getGoogleOauthURL(async (token) => {
            this.setToken(token);
            // // save token
            await saveToken(token);
            res();
          }).catch(rej);
        });
        //
      } else if (e.response && e.response.status === 401) {
        const { access_token } = await getGoogleOauthTokens(
          "refresh_token",
          this.token.refresh_token
        );
        this.token.access_token = access_token;
        saveToken(this.token);
      } else {
        throw new Error(e.message);
      }
    }
  },

  async uploadFile(filename, data, folderId) {
    try {
      const url = `https://www.googleapis.com/upload/drive/v3/files`;

      const {
        headers: { location },
      } = await axios.post(
        url,
        {
          name: filename,
          parents: [folderId],
        },
        {
          headers: {
            Authorization: `Bearer ${this.token.access_token}`,
            "Content-Type": "application/json",
          },
          params: {
            fields: "id",
            uploadType: "resumable",
          },
        }
      );

      const fileSize = data.length;
      const res = await axios.put(location, data, {
        headers: {
          "Content-Length": fileSize,
        },
      });

      return res.data;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async getFolderId(folderName = "root") {
    try {
      const res = await axios.get(`${BASE_URL}/files`, {
        headers: {
          Authorization: `Bearer ${this.token.access_token}`,
        },
        params: {
          q: `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}'`,
          trashed: false,
          fields: "files(id)",
        },
      });

      const folders = res.data.files;
      return folders[0] ? folders[0].id : null;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async getFileLink(fileId) {
    try {
      const res = await axios.get(`${BASE_URL}/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${this.token.access_token}`,
        },
        params: {
          fields: "webViewLink",
        },
      });

      return res.data.webViewLink;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async createFolder(name) {
    try {
      const res = await axios.post(
        `${BASE_URL}/files`,
        {
          name,
          mimeType: "application/vnd.google-apps.folder",
        },
        {
          headers: {
            Authorization: `Bearer ${this.token.access_token}`,
          },
        }
      );

      return res.data;
    } catch (e) {
      throw new Error(e.message);
    }
  },
};

async function getGoogleOauthURL(cb) {
  const options = {
    redirect_uri: CREDS.redirect_uris,
    client_id: CREDS.client_id,
    scope: SCOPES.join(" "),
    response_type: "code",
    access_type: "offline",
  };

  const query = new URLSearchParams(options);
  startOauthRedirectServer(cb);

  open(`${CREDS.auth_uri}?${query.toString()}`);
  console.log("Waiting for authentication");
}

async function startOauthRedirectServer(cb) {
  const server = new http.createServer(async (req, res) => {
    const url = req.url;

    if (url.startsWith("/oauth2callback")) {
      // get token and save it in token.json
      const token = await googleOauthHandler(req, res);
      cb(token);
      server.close();
      return;
    }

    res.end("");
  });
  server.listen(7876);
}

async function googleOauthHandler(req, res) {
  // get code from query string;
  const query = qs.parse(req.url.slice(16));
  const code = query.code;

  // get access token with the code
  const data = await getGoogleOauthTokens("code", code);
  const token = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  };

  res.end(
    "Authentication was succeeded, you can close this window and back to the console"
  );
  console.log("Authentication successful");
  return token;
}

async function getGoogleOauthTokens(by = "code", data) {
  const values = {
    [by]: data,
    client_id: CREDS.client_id,
    client_secret: CREDS.client_secret,
    redirect_uri: CREDS.redirect_uris[0],
    grant_type: by === "refresh_token" ? by : "authorization_code",
  };

  try {
    const res = await axios.post(CREDS.token_uri, values, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  } catch (e) {
    console.error(e, "Failed to fetch Google Oauth Token");
    throw new Error(e.message);
  }
}

async function saveToken(token) {
  await writeFile("token.json", JSON.stringify(token));
}
