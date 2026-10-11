# Mist

An Omarchy shell service plugin that draws faint, slow-drifting mist over the
wallpaper. It sits on the Bottom layer, above `omarchy.background` and below
every window, and takes no input. It is meant to be seen softly through
translucent terminals (foot `alpha` + `alpha-mode=all` + Hyprland blur).

- `shaders/mist.frag`: domain-warped fbm noise, compiled to `mist.frag.qsb` by
  `build.sh` (needs `qt6-shadertools`). The compiled shader is committed too.
- `Service.qml`: `tint`, `strength` and the 20 fps time step.

Enable with `omarchy plugin enable io.github.connorgunderson.mist`. Edits load
on `omarchy restart shell`.
