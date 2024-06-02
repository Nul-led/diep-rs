#!/bin/bash

tmux new-session -d -s diep-rs

tmux send-keys 'npm run watch --prefix web' C-m

tmux split-window -h
tmux send-keys 'trunk serve' C-m

tmux attach-session -t diep-rs