import Quickshell
import Quickshell.Wayland
import QtQuick

// Faint drifting mist on the Bottom layer: above omarchy.background's
// wallpaper, below every window. It shows through translucent terminals
// (foot alpha + Hyprland blur), so it reads as a slow wash, not motion.
Item {
  id: root

  // Pale sage from the arbor palette; the wisps are this colour at most
  // `strength` opacity.
  property color tint: "#e6e8de"
  property real strength: 1.0

  // Time advances at a capped frame rate: the drift is slow enough that
  // 20 fps looks smooth and keeps the GPU idle between frames.
  property real time: 0

  Timer {
    interval: 50
    running: true
    repeat: true
    onTriggered: root.time += interval / 1000
  }

  Variants {
    model: Quickshell.screens

    PanelWindow {
      required property var modelData

      screen: modelData
      anchors { top: true; bottom: true; left: true; right: true }
      color: "transparent"
      exclusionMode: ExclusionMode.Ignore
      WlrLayershell.layer: WlrLayer.Bottom
      WlrLayershell.namespace: "mist"
      WlrLayershell.keyboardFocus: WlrKeyboardFocus.None

      // An empty input region: every click falls through to the desktop.
      mask: Region {}

      ShaderEffect {
        anchors.fill: parent
        property real time: root.time
        property real aspect: width / Math.max(1, height)
        property real strength: root.strength
        property color tint: root.tint
        fragmentShader: Qt.resolvedUrl("shaders/mist.frag.qsb")
      }
    }
  }
}
