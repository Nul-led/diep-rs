#!/bin/bash

tmux new-session -d -s diep-rs

tmux send-keys 'npm run watch --prefix web' C-m

tmux split-window -h
tmux send-keys 'trunk serve --no-default-features --features client' C-m

tmux select-pane -t 0
tmux split-window -h
tmux send-keys 'cargo watch -x "run --no-default-features --features server --target x86_64-unknown-linux-gnu"' C-m

tmux attach-session -t diep-rs