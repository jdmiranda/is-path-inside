import path from 'node:path';

// Cache for resolved paths to avoid repeated path.resolve calls
const resolvedCache = new Map();
const MAX_CACHE_SIZE = 1000;

function getCachedResolvedPath(inputPath) {
	if (resolvedCache.has(inputPath)) {
		return resolvedCache.get(inputPath);
	}

	const resolved = path.resolve(inputPath);

	// Simple LRU: clear cache when it gets too large
	if (resolvedCache.size >= MAX_CACHE_SIZE) {
		const firstKey = resolvedCache.keys().next().value;
		resolvedCache.delete(firstKey);
	}

	resolvedCache.set(inputPath, resolved);
	return resolved;
}

export default function isPathInside(childPath, parentPath) {
	// Fast path: Check if inputs are already absolute paths
	const childIsAbsolute = path.isAbsolute(childPath);
	const parentIsAbsolute = path.isAbsolute(parentPath);

	// Normalize paths once using cache
	const resolvedChild = childIsAbsolute ? childPath : getCachedResolvedPath(childPath);
	const resolvedParent = parentIsAbsolute ? parentPath : getCachedResolvedPath(parentPath);

	// Fast path: Same path check
	if (resolvedChild === resolvedParent) {
		return false;
	}

	// Fast path: Child is shorter than parent (cannot be inside)
	if (resolvedChild.length <= resolvedParent.length) {
		return false;
	}

	// Use relative to check containment
	const relation = path.relative(resolvedParent, resolvedChild);

	// Optimized checks:
	// 1. Empty relation means same path (already handled above)
	// 2. '..' means child is parent's parent
	// 3. Starting with '../' means child is outside parent
	// 4. If relation equals the resolved child path, it means child is not under parent
	return Boolean(
		relation &&
		relation !== '..' &&
		!relation.startsWith(`..${path.sep}`) &&
		relation !== resolvedChild
	);
}
