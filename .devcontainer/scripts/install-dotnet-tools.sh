dotnet tool install -g Amazon.Lambda.Tools
dotnet new -i "Amazon.Lambda.Templates::*"
dotnet tool install -g dotnet-outdated-tool

export PATH="$PATH:/home/vscode/.dotnet/tools"

cat << \EOF >> ~/.bashrc
export PATH="$PATH:/home/vscode/.dotnet/tools"
EOF
