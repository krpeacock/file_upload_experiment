import { AnonymousIdentity, Identity } from "@dfinity/agent";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AuthClient } from "@dfinity/auth-client";
import {
  file_upload_assets,
  createActor,
  canisterId,
} from "../../declarations/file_upload_assets";

const App = () => {
  const [authClient, setAuthClient] = React.useState<AuthClient | null>(null);
  const [identity, setIdentity] = React.useState<Identity | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [fetchedIndex, setFetchedIndex] = React.useState("");

  React.useEffect(() => {
    (async () => {
      const authClient = await AuthClient.create();
      setAuthClient(authClient);
      setIsAuthenticated(await authClient.isAuthenticated());
    })();
  }, [setAuthClient, setIsAuthenticated]);

  React.useEffect(() => {
    if (!isAuthenticated || !authClient) {
      return;
    }
    (async () => {
      const identity = authClient.getIdentity();
      const assetActor = createActor(canisterId, {
        agentOptions: { identity: authClient?.getIdentity() },
      });

      file_upload_assets
        .http_request({
          url: "/index.html",
          body: [],
          method: "GET",
          headers: [],
        })
        .then((response) => {
          const result = new TextDecoder().decode(
            new Uint8Array(response.body)
          );
          setFetchedIndex(result);
        });

      const foobar = [...new TextEncoder().encode("foobar")];

      const update = await assetActor.store({
        key: "/foobar.txt",
        content: foobar,
        sha256: [],
        content_type: "text/plain",
        content_encoding: "identity",
      });

      const get = await assetActor.get({
        key: "/foobar.txt",
        accept_encodings: ["identity"],
      });
      debugger;
    })();
  }, [setAuthClient, setIsAuthenticated, isAuthenticated]);

  const handleLogin = async () => {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      // handleAuthenticated(authClient);
    }
    await authClient.login({
      onSuccess: async () => {
        setIsAuthenticated(true);
      },
      identityProvider:
        process.env.NODE_ENV === "development"
          ? "http://rkp4c-7iaaa-aaaaa-aaaca-cai.localhost:8000"
          : "https://identity.ic0.app",
    });
  };

  console.log(authClient?.getIdentity().getPrincipal().toString());

  if (!isAuthenticated) {
    return (
      <main>
        <button id="login" onClick={handleLogin}>
          Log In with Internet Identity
        </button>
      </main>
    );
  }

  return (
    <main>
      <h1>You are logged in!</h1>
      principal: {authClient?.getIdentity().getPrincipal().toString()}
      <div>
        <pre>
          <code>{fetchedIndex}</code>
        </pre>
      </div>
    </main>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
