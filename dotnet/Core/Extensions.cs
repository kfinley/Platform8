using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Platform8.Core
{
    public static class Extensions
    {
        [DebuggerStepThrough]
        public static void ForEach<T>(this IEnumerable<T> items, Action<T> action) {
            foreach (var item in items)
                action(item);
        }
        
        [DebuggerStepThrough]
        public static bool HasValue(this object target) {
            if (target != null) {
                switch (target.GetType().Name) {
                    case "Guid":
                        return HasValue((Guid)target);
                    case "String":
                        return !string.IsNullOrEmpty((string)target);
                    default:
                        return true;
                }
            }
            return false;
        }
        [DebuggerStepThrough]
        public static bool HasValue(this Guid target) {
            return target != Guid.Empty;
        }
    }
}
