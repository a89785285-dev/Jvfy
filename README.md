# VANTA CODE 1.0 — Rebuilt from zero

Fresh Android Studio project using Kotlin, Jetpack Compose and Rhino.

## Included
- New dark VANTA studio UI
- Editor with line numbers and quick-insert keys
- JavaScript execution using Rhino with console output
- Open and Save As using Android document picker
- Projects and Settings screens
- GitHub Actions workflow to build a debug APK

## Runtime status
JavaScript is executable. Python, Java, Kotlin, C/C++, PHP and Dart are editor-only placeholders in this build; their runtimes/compilers are not included.

## Build
Open the project in Android Studio with JDK 17 and let Gradle sync. Run the `app` configuration. The GitHub Actions workflow can build a debug APK on `main` or by manual dispatch.

This is source code, not a verified signed release APK. A build and device test are still required.
\n\n## Compact side toolbar update\n- Editor actions are grouped in a narrow vertical toolbar.
- Run, Open, Save, Insert, Clear, Language, Projects and Settings are stacked vertically.
- The bottom action row/navigation bar has been removed to maximize editor space.
