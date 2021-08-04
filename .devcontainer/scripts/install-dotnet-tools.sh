# For building .net Lambda packages...
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --runtime aspnetcore --version 3.1.17

#TODO: guard this so script is only run from root (/workspace)
curl -sSL https://aka.ms/getvsdbgsh | bash /dev/stdin -v latest -l ./.devcontainer/vsdbg

dotnet tool install -g Amazon.Lambda.Tools
dotnet new -i "Amazon.Lambda.Templates::*"
dotnet tool install --global dotnet-ef
dotnet tool install -g dotnet-outdated-tool

export PATH="$PATH:/home/vscode/.dotnet/tools"

export DOTNET_CLI_TELEMETRY_OPTOUT="true"

cat << \EOF >> ~/.bashrc
export PATH="$PATH:/home/vscode/.dotnet/tools"
EOF
