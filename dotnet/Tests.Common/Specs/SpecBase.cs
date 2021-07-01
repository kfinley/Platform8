using Machine.Specifications;
using Xunit;

namespace Platform8.Tests.Common.Specs {

    public abstract class SpecBase : IClassFixture<MSpecFixture> {
        private object lockObject = new object();

        protected MSpecFixture Fixture;

        public SpecBase(MSpecFixture fixture) {
            Fixture = fixture;
        }

        protected void Setup(IClassFixture<MSpecFixture> spec, Establish context, Because of) {
            lock(lockObject)
                Fixture.Setup(spec, context, of);
        }
    }
}
