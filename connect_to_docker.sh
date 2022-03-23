#!/bin/bash
isSelected=false
while [ -n "$1" ]; do # while loop starts

	case "$1" in

	-c) echo "*********   *********"
      echo "********* Connect to Contract*********" # Message for -a option
      echo "*********   *********"
      containerName=shapescontract_contracts_1
			isSelected=true
      ;;
	-g) echo "*********   *********"
      echo "********* Connect to Ganache *********" # Message for -a option
      echo "*********   *********"
      containerName=shapescontract_ganache_1
      isSelected=true
      ;;
  -h)

echo "Usage: ./connect_to_docker.sh [OPTION]"
echo "Connect to a bash terminal of the container specified in OPTION"
echo ""
echo " OPTIONs availables"
echo "-c          contracts"
echo "-g          ganache"
exit
      ;;
	*) echo "Option $1 not recognized"
  exit;; # In case you typed a different option other than a,b,c

	esac

	shift
done

if ${isSelected}; then
  echo "Opening bash console"
  docker exec --tty --interactive $containerName bash
else
  echo "please specify a container"
fi
