#!/bin/bash
jq --arg text "$(<$1.html)" '.HtmlPart=$text' $1Template.json >temp_$1
mv $1Template.json $1Template.bak
mv temp_$1 $1Template.json
rm $1Template.bak

