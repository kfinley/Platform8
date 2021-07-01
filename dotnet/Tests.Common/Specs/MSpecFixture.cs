using System;
using System.Collections.Generic;
using System.Linq;
using Machine.Specifications;
using Xunit;

namespace Platform8.Tests.Common.Specs {

    public class MSpecFixture {
        private IList<string> specs = new List<string>();

        public void Setup(IClassFixture<MSpecFixture> spec, Establish context, Because of) {

            if (specs.Any(s => s == spec.GetType().Name) == false) {
                specs.Add(spec.GetType().Name);
                System.Console.WriteLine($"Running Spec: {spec.GetType().Name}...");
                try {
                    context();
                    of();
                } catch (Exception e) {
                    Console.WriteLine($"Error in Spec Setup. Message: {e.Message}");
                    Console.WriteLine($"Stack Trace: {e.StackTrace}");
                }
            }
        }
    }
}
