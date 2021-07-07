dotnet tool install -g Amazon.Lambda.Tools
dotnet new -i "Amazon.Lambda.Templates::*"
dotnet tool install --global dotnet-ef
dotnet tool install -g dotnet-outdated-tool

export PATH="$PATH:/home/vscode/.dotnet/tools"

export DOTNET_CLI_TELEMETRY_OPTOUT="true"

cat << \EOF >> ~/.bashrc
export PATH="$PATH:/home/vscode/.dotnet/tools"
EOF
