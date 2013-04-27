closure-library/closure/bin/build/closurebuilder.py \
  -f "--js=closure-library/closure/goog/deps.js" \
  -f "--js=js/sw-deps.js" \
  --root=closure-library/ \
  --root=js \
  --namespace="sw.StreamWatch" \
  --output_mode=compiled \
  --compiler_jar=closure-library/closure/bin/compiler.jar \
  --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
  --compiler_flags="--warning_level=VERBOSE" > js/streamwatch.min.js