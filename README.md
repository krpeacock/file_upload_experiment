# File Upload Experiment

This project is a simple experiment to see how to create and then fetch an asset on an aset canister.

Get it going with dfx 0.7.7

```
dfx start --background --clean
dfx deploy
npm start
```

The core logic is in index.tsx. The `file_upload_assets` import is able to make anonymous calls, and I use a local instance of Internet Identity to get an authenticated identity to make calls with a custom `assetActor`.

Note: to test this out yourself, you will need to manually call `authorize` for the `file_upload_assets` canister using dfx before authenticated methods will work.

```
dfx canister call file_upload_assets authorize '("<principal string>": text)'
```