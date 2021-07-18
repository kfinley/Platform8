rm -f -- accounts-deploy-package.zip
dotnet lambda package -pl Functions --configuration Debug --framework netcoreapp3.1 --output-package accounts-deploy-package.zip
