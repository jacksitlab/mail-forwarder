#!/bin/bash

VERSION=$(npm -s run env echo '$npm_package_version')
docker build -t jacksitlab/mail-forwarder:$VERSION -t jacksitlab/mail-forwarder:latest .