#!/bin/sh
closure-library/closure/bin/build/depswriter.py \
  --root_with_prefix="js ../../../js" > js/sw-deps.js
