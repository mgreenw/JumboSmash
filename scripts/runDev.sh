if screen -ls run-halliganhelper-dev > /dev/null; then
    echo 'JumboSmash dev instance is already running. Use `screen -list` then `screen -dr PIN` to reattach to the existing session.'
    exit 1
fi

cd ./scripts
screen -S run-jumbosmash-dev -c screenrc
