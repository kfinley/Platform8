﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Platform8.FinancialAccounts.Data;

namespace FinancialAccounts.Api.Migrations
{
    [DbContext(typeof(FinancialAccountsDataContext))]
    [Migration("20210718192308_Balances")]
    partial class Balances
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 64)
                .HasAnnotation("ProductVersion", "5.0.7");

            modelBuilder.Entity("Platform8.FinancialAccounts.Models.Account", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("char(36)");

                    b.Property<string>("AccountType")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("FinancialInstitution")
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .HasColumnType("longtext");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("char(36)");

                    b.Property<decimal>("StartingBalance")
                        .HasColumnType("decimal(65,30)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("Id");

                    b.ToTable("Accounts");
                });

            modelBuilder.Entity("Platform8.FinancialAccounts.Models.Balance", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("char(36)");

                    b.Property<Guid?>("AccountId")
                        .HasColumnType("char(36)");

                    b.Property<decimal>("Amount")
                        .HasColumnType("decimal(65,30)");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AccountId");

                    b.HasIndex("Id");

                    b.ToTable("Balances");
                });

            modelBuilder.Entity("Platform8.FinancialAccounts.Models.Balance", b =>
                {
                    b.HasOne("Platform8.FinancialAccounts.Models.Account", "Account")
                        .WithMany("Balances")
                        .HasForeignKey("AccountId");

                    b.Navigation("Account");
                });

            modelBuilder.Entity("Platform8.FinancialAccounts.Models.Account", b =>
                {
                    b.Navigation("Balances");
                });
#pragma warning restore 612, 618
        }
    }
}
