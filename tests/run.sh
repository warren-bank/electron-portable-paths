#!/usr/bin/env bash

log_file='./run.output.txt'
[ -e "$log_file" ] && rm -rf "$log_file"

node './01-defaults.js'  >>"$log_file"
node './02-custom.js'    >>"$log_file"
node './03-blacklist.js' >>"$log_file"
