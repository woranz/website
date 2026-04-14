#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"

request_status() {
  local method="$1"
  local url="$2"
  local body="${3:-}"
  local extra_header="${4:-}"
  local -a curl_args=(
    -sS
    -o /tmp/api-boundary.out
    -D /tmp/api-boundary.headers
    -X "$method"
  )

  if [[ -n "$extra_header" ]]; then
    curl_args+=(-H "$extra_header")
  fi

  if [[ -n "$body" ]]; then
    curl_args+=(-H "Content-Type: application/json" --data "$body")
  else
    :
  fi

  curl "${curl_args[@]}" "${BASE_URL}${url}" >/dev/null
}

assert_status() {
  local expected="$1"
  grep -E "^HTTP/.* ${expected}" /tmp/api-boundary.headers >/dev/null
}

echo "== invalid AP persona lookup =="
request_status POST "/api/ap/persona" '{"dni":"AB12345"}'
assert_status 400

echo "== invalid caucion lookup =="
request_status POST "/api/caucion/lookup" '{"dni":"123456"}'
assert_status 400

echo "== foreign-origin POST blocked =="
request_status POST "/api/ap/persona" '{"dni":"12345678"}' "Origin: https://evil.example"
assert_status 403

echo "== malformed AP trigger payload =="
request_status POST "/api/ap/cotizacion/trigger" '{}'
assert_status 400

echo "== old documentos/email GET contract disabled =="
request_status GET "/api/ap/documentos/email?idEmision=1&email=test@example.com&idImpresion=361"
grep -E "^HTTP/.* (404|405)" /tmp/api-boundary.headers >/dev/null

echo "== new documentos/email invalid POST =="
request_status POST "/api/ap/documentos/email" '{"idEmision":"1","email":"bad-email","idImpresion":"361"}'
assert_status 400

echo "== AP persona rate limit =="
rate_limited=0
for _ in $(seq 1 25); do
  request_status POST "/api/ap/persona" '{"dni":"12345678"}'
  if grep -E "^HTTP/.* 429" /tmp/api-boundary.headers >/dev/null; then
    rate_limited=1
    break
  fi
done

if [[ "$rate_limited" -ne 1 ]]; then
  echo "Expected rate limiting on /api/ap/persona but did not observe 429" >&2
  exit 1
fi

echo "API boundary smoke checks passed."
