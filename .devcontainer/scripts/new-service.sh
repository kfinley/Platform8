#!/bin/bash

# This is a service scaffolding script.
# Currently creates DotNetCore structure & references.
# Should be run from /workspace
#
# Example: $> ./.devcontainer/scripts/new-service.sh Product
#

service_name=$1
cd ./services

echo Creating service directory structure...
mkdir $1
cd $1
# Creating each directory isn't necessary but keeping for documentation clarity
mkdir Api Commands Data Functions infrastructure Models Tests

echo
echo Creating dotnetcore projects...
dotnet new webapi -o Api -n $1.Api
dotnet new classlib --framework "netstandard2.1" -o Commands -n $1.Commands
dotnet new classlib --framework "netstandard2.1" -o Data -n $1.Data
dotnet new classlib --framework "netstandard2.1" -o Models -n $1.Models
dotnet new lambda.EmptyFunction -o Functions -n $1.Functions
mv Functions/src/$1.Functions/* Functions/
rm -rf Functions/src
rm -rf Functions/test
dotnet new xunit -o Tests -n $1.Tests

echo 
echo Creating dotnet solution and adding projects...
dotnet new sln
dotnet sln add Api/$1.Api.csproj
dotnet sln add Commands/$1.Commands.csproj
dotnet sln add Data/$1.Data.csproj
dotnet sln add Models/$1.Models.csproj
dotnet sln add Functions/$1.Functions.csproj
dotnet sln add Tests/$1.Tests.csproj

echo
echo Adding project references..

CORE_PROJECT=../../dotnet/Core/Core.csproj
CORE_DATA_PROJECT=../../dotnet/Core.Data/Core.Data.csproj
TESTS_COMMON_PROJECT=../../dotnet/Tests.Common/Tests.Common.csproj

echo 
echo Adding API project references... 
dotnet add Api/$1.Api.csproj package MediatR
dotnet add Api/$1.Api.csproj package MediatR.Extensions.Microsoft.DependencyInjection
dotnet add Api/$1.Api.csproj package AWSSDK.Extensions.NETCore.Setup
dotnet add Api/$1.Api.csproj package EFContinuousMigrations
dotnet add Api/$1.Api.csproj package Microsoft.EntityFrameworkCore
dotnet add Api/$1.Api.csproj package Microsoft.EntityFrameworkCore.Design
dotnet add Api/$1.Api.csproj package Pomelo.EntityFrameworkCore.MySql
dotnet add Api/$1.Api.csproj reference $CORE_PROJECT Commands/$1.Commands.csproj

echo
echo Adding Commands project reference...
dotnet add Commands/$1.Commands.csproj package MediatR
dotnet add Commands/$1.Commands.csproj package Microsoft.Extensions.Logging
dotnet add Commands/$1.Commands.csproj package Microsoft.Extensions.Options
dotnet add Commands/$1.Commands.csproj reference $CORE_PROJECT $CORE_DATA_PROJECT Data/$1.Data.csproj Models/$1.Models.csproj

echo
echo Adding Data project references...
dotnet add Data/$1.Data.csproj package Microsoft.EntityFrameworkCore
dotnet add Data/$1.Data.csproj package Pomelo.EntityFrameworkCore.MySql
dotnet add Data/$1.Data.csproj reference $CORE_DATA_PROJECT Models/$1.Models.csproj

echo
echo Adding Models project reference...
dotnet add Models/$1.Models.csproj package MediatR

echo
echo Adding Tests project reference...
dotnet add Tests/$1.Tests.csproj package FluentAssertions
dotnet add Tests/$1.Tests.csproj package Machine.Specifications
dotnet add Tests/$1.Tests.csproj package MediatR
dotnet add Tests/$1.Tests.csproj package MediatR.Extensions.Microsoft.DependencyInjection
dotnet add Tests/$1.Tests.csproj package Moq
dotnet add Tests/$1.Tests.csproj package Moq.AutoMock
dotnet add Tests/$1.Tests.csproj reference $TESTS_COMMON_PROJECT $CORE_DATA_PROJECT Models/$1.Models.csproj Commands/$1.Commands.csproj Data/$1.Data.csproj

echo
echo Creating Serverless config files...
touch infrastructure/environment.yml
touch infrastructure/functions.yml
touch infrastructure/resources.yml
touch infrastructure/stateMachines.yml

echo
echo -e Done! "\xF0\x9f\x8d\xba"
