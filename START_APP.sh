#!/bin/bash

echo "Starting Telegram Broadcaster..."
echo ""
echo "Installing dependencies..."
npm install

echo ""
echo "Building application..."
npm run build

echo ""
echo "Starting app at http://localhost:3000"
echo "Press Ctrl+C to stop"
echo ""

npm start
