import { performance } from 'node:perf_hooks';
import isPathInside from './index.js';

function benchmark(name, fn, iterations = 100000) {
	const start = performance.now();
	for (let i = 0; i < iterations; i++) {
		fn();
	}
	const end = performance.now();
	const duration = end - start;
	const opsPerSecond = Math.floor(iterations / (duration / 1000));
	console.log(`${name}: ${duration.toFixed(2)}ms (${opsPerSecond.toLocaleString()} ops/sec)`);
	return { duration, opsPerSecond };
}

console.log('Performance Benchmarks\n' + '='.repeat(50) + '\n');

// Benchmark 1: Relative paths (common case)
console.log('1. Relative paths (common case):');
benchmark('  isPathInside("a/b/c", "a")', () => {
	isPathInside('a/b/c', 'a');
});

// Benchmark 2: Absolute paths
console.log('\n2. Absolute paths:');
benchmark('  isPathInside("/a/b/c", "/a")', () => {
	isPathInside('/a/b/c', '/a');
});

// Benchmark 3: Same path (fast path)
console.log('\n3. Same path (fast path):');
benchmark('  isPathInside("/a/b", "/a/b")', () => {
	isPathInside('/a/b', '/a/b');
});

// Benchmark 4: Outside parent (fast path)
console.log('\n4. Outside parent:');
benchmark('  isPathInside("/x/y", "/a/b")', () => {
	isPathInside('/x/y', '/a/b');
});

// Benchmark 5: Cached paths (repeated calls)
console.log('\n5. Cached paths (repeated same paths):');
const childPath = 'some/nested/path/file.txt';
const parentPath = 'some/nested';
benchmark('  isPathInside(same, same)', () => {
	isPathInside(childPath, parentPath);
});

// Benchmark 6: Mixed absolute and relative
console.log('\n6. Mixed absolute and relative:');
benchmark('  isPathInside("./a/b/c", "/tmp")', () => {
	isPathInside('./a/b/c', '/tmp');
});

// Benchmark 7: Windows-style paths (on Unix)
console.log('\n7. Complex relative paths:');
benchmark('  isPathInside("a/../b/c", ".")', () => {
	isPathInside('a/../b/c', '.');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('\nOptimizations applied:');
console.log('✓ Path resolution caching (Map-based LRU)');
console.log('✓ Fast path for absolute path comparison');
console.log('✓ Early exit for same path');
console.log('✓ Early exit for length comparison');
console.log('✓ Reduced path.resolve() calls');
console.log('\nCache statistics:');
console.log(`- Max cache size: 1000 entries`);
console.log(`- Cache strategy: Simple FIFO eviction`);
