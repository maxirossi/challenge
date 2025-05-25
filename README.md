# mate-mono-repo

Requisitos iniciales

1) Docker
2) Docker-Compose

Ubicarse en el root del proyecto y dar permisos de ejecución a build.sh e init.sh

sudo chmod +x build.sh
sudo chmod +x init.sh

En caso de no usar un sitema basado en unix, se puede hacer de forma manual. (Recomendamos igualmente Linux, Mac o en Windows WSL)

Luego ejecutar 

./build.sh

Una vez terminado, correr las migrations y crear una
cola de kafka.

./init.sh

