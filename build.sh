#!/usr/bin/env bash
# Compiles the mist shader for Qt 6 (ShaderEffect loads .qsb, not GLSL).
set -euo pipefail
here="$(dirname "$(realpath "$0")")"
/usr/lib/qt6/bin/qsb --glsl "100es,120,150" --hlsl 50 --msl 12 \
  -o "$here/shaders/mist.frag.qsb" "$here/shaders/mist.frag"
