# elo_hub
Home Node Server - Runs on a PI


-- need to build on the pi (any pi)
-- use PKG to build out the binary
```
pkg -t node8-linux -o elo_hub out/src/app.js
```

-- change the exec permission on the file
```
chmod +x elo_hub
```

