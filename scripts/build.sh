#!/bin/bash
dir=$(pwd)

chapterData=()

mkdir $dir/build

for filepath in ./chapters/*.md
do
    updatedAt=$(git log -1 --pretty="format:%cI" $filepath)
    createdAt=$(git log --diff-filter=A --follow --format=%cI -1 -- $filepath)
    filename=$(basename -- "$filepath")
    filename_with_no_extension="${filename%.*}"
    chapterData+=($filename_with_no_extension $createdAt $updatedAt)
    output="$dir/build/$filename_with_no_extension.html"
    npx marked -i $filepath -o $output
    echo "Built chapter $filename_with_no_extension"
done

node "$dir/scripts/buildChaptersMetadata.js" ${chapterData[*]}