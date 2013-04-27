#!/bin/sh
files=`find js/ -regex .*soy$ | tr '\n' ' '`
if [[ $files -ne '' ]]; then
  java -jar closure-library/closure/bin/SoyToJsSrcCompiler.jar \
    --shouldGenerateJsdoc \
    --shouldGenerateGoogMsgDefs \
    --shouldProvideRequireSoyNamespaces \
    --useGoogIsRtlForBidiGlobalDir \
    --outputPathFormat '{INPUT_DIRECTORY}/{INPUT_FILE_NAME_NO_EXT}_generated.js' \
    $files
fi
