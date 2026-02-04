/**
 * Coordinate Transformation Utilities for Badaplot
 * 
 * CRITICAL CONTRACT:
 * - All geometry is stored in IMAGE PIXEL SPACE (absolute coordinates)
 * - SVG viewBox MUST match image dimensions exactly
 * - No coordinate recalculation at runtime
 * - Zoom/pan are CSS transforms only, never affect coordinates
 * 
 * This module provides the ONLY way to convert between:
 * - Client space (browser viewport pixels)
 * - SVG space (image pixel coordinates)
 */

/**
 * Convert client coordinates (mouse position) to SVG space coordinates
 * 
 * This is the CRITICAL function for accurate click detection and polygon drawing.
 * Must be used for ALL mouse interactions with the SVG overlay.
 * 
 * @param {number} clientX - Mouse X position from event.clientX
 * @param {number} clientY - Mouse Y position from event.clientY
 * @param {SVGSVGElement} svgElement - The SVG element reference
 * @returns {{ x: number, y: number }} Coordinates in SVG space
 * 
 * @example
 * const handleClick = (e) => {
 *   const svgCoords = clientToSVG(e.clientX, e.clientY, svgRef.current);
 *   console.log(`Clicked at image pixel: (${svgCoords.x}, ${svgCoords.y})`);
 * };
 */
export function clientToSVG(clientX, clientY, svgElement) {
    if (!svgElement) {
        console.error('SVG element is required for coordinate transformation');
        return { x: 0, y: 0 };
    }

    // Create SVG point for transformation
    const point = svgElement.createSVGPoint();
    point.x = clientX;
    point.y = clientY;

    // Get the inverse screen CTM (Current Transformation Matrix)
    // This accounts for all CSS transforms (zoom, pan, etc.)
    const ctm = svgElement.getScreenCTM();
    if (!ctm) {
        console.error('Could not get screen CTM from SVG element');
        return { x: 0, y: 0 };
    }

    // Transform client coordinates to SVG space
    const svgPoint = point.matrixTransform(ctm.inverse());

    return {
        x: svgPoint.x,
        y: svgPoint.y
    };
}

/**
 * Convert SVG space coordinates to client coordinates
 * Useful for positioning tooltips, modals, etc. relative to SVG elements
 * 
 * @param {number} svgX - X coordinate in SVG space
 * @param {number} svgY - Y coordinate in SVG space  
 * @param {SVGSVGElement} svgElement - The SVG element reference
 * @returns {{ x: number, y: number }} Coordinates in client space
 */
export function svgToClient(svgX, svgY, svgElement) {
    if (!svgElement) {
        console.error('SVG element is required for coordinate transformation');
        return { x: 0, y: 0 };
    }

    const point = svgElement.createSVGPoint();
    point.x = svgX;
    point.y = svgY;

    const ctm = svgElement.getScreenCTM();
    if (!ctm) {
        console.error('Could not get screen CTM from SVG element');
        return { x: 0, y: 0 };
    }

    const clientPoint = point.matrixTransform(ctm);

    return {
        x: clientPoint.x,
        y: clientPoint.y
    };
}

/**
 * Validate that coordinates are within image bounds
 * Essential for preventing invalid geometry during digitization
 * 
 * @param {number} x - X coordinate to validate
 * @param {number} y - Y coordinate to validate
 * @param {number} imageWidth - Width of the image in pixels
 * @param {number} imageHeight - Height of the image in pixels
 * @param {number} margin - Optional margin (default 0)
 * @returns {boolean} True if coordinates are valid
 */
export function validateCoordinates(x, y, imageWidth, imageHeight, margin = 0) {
    return (
        x >= margin &&
        y >= margin &&
        x <= imageWidth - margin &&
        y <= imageHeight - margin
    );
}

/**
 * Clamp coordinates to image bounds
 * Useful when snapping points or preventing out-of-bounds placement
 * 
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} imageWidth - Width of the image
 * @param {number} imageHeight - Height of the image
 * @returns {{ x: number, y: number }} Clamped coordinates
 */
export function clampToImage(x, y, imageWidth, imageHeight) {
    return {
        x: Math.max(0, Math.min(x, imageWidth)),
        y: Math.max(0, Math.min(y, imageHeight))
    };
}

/**
 * Point-in-Polygon algorithm (Ray Casting)
 * Determines if a point is inside a polygon
 * 
 * Used for accurate click detection on plots
 * 
 * @param {{ x: number, y: number }} point - Point to test
 * @param {Array<{ x: number, y: number }>} polygon - Array of polygon vertices
 * @returns {boolean} True if point is inside polygon
 * 
 * @example
 * const polygon = [
 *   { x: 100, y: 100 },
 *   { x: 200, y: 100 },
 *   { x: 200, y: 200 },
 *   { x: 100, y: 200 }
 * ];
 * const isInside = pointInPolygon({ x: 150, y: 150 }, polygon); // true
 */
export function pointInPolygon(point, polygon) {
    if (!polygon || polygon.length < 3) {
        return false;
    }

    let inside = false;
    const x = point.x;
    const y = point.y;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x;
        const yi = polygon[i].y;
        const xj = polygon[j].x;
        const yj = polygon[j].y;

        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) {
            inside = !inside;
        }
    }

    return inside;
}

/**
 * Parse SVG path data to polygon vertices
 * Converts "M100,100 L200,100 L200,200 L100,200 Z" to array of points
 * 
 * @param {string} svgPath - SVG path string
 * @returns {Array<{ x: number, y: number }>} Array of vertices
 */
export function parseSVGPath(svgPath) {
    if (!svgPath || typeof svgPath !== 'string') {
        return [];
    }

    const vertices = [];

    // Remove the trailing Z (close path command)
    const pathWithoutZ = svgPath.replace(/Z$/i, '').trim();

    // Split by commands (M or L)
    const commands = pathWithoutZ.split(/(?=[ML])/i);

    commands.forEach(cmd => {
        // Remove the command letter and split coordinates
        const coords = cmd.substring(1).trim().split(/[\s,]+/);

        if (coords.length >= 2) {
            vertices.push({
                x: parseFloat(coords[0]),
                y: parseFloat(coords[1])
            });
        }
    });

    return vertices;
}

/**
 * Generate SVG path string from polygon vertices
 * Converts array of points to "M100,100 L200,100 L200,200 L100,200 Z"
 * 
 * @param {Array<{ x: number, y: number }>} vertices - Array of polygon vertices
 * @returns {string} SVG path string
 */
export function generateSVGPath(vertices) {
    if (!vertices || vertices.length < 3) {
        return '';
    }

    let path = `M${vertices[0].x},${vertices[0].y}`;

    for (let i = 1; i < vertices.length; i++) {
        path += ` L${vertices[i].x},${vertices[i].y}`;
    }

    path += ' Z'; // Close the path

    return path;
}

/**
 * Calculate the centroid (geometric center) of a polygon
 * Used for placing plot numbers/labels
 * 
 * @param {Array<{ x: number, y: number }>} vertices - Polygon vertices
 * @returns {{ x: number, y: number }} Centroid coordinates
 */
export function calculateCentroid(vertices) {
    if (!vertices || vertices.length === 0) {
        return { x: 0, y: 0 };
    }

    let sumX = 0;
    let sumY = 0;

    vertices.forEach(vertex => {
        sumX += vertex.x;
        sumY += vertex.y;
    });

    return {
        x: sumX / vertices.length,
        y: sumY / vertices.length
    };
}

/**
 * Calculate the area of a polygon using the Shoelace formula
 * Used for validation (ensure polygon has non-zero area)
 * 
 * @param {Array<{ x: number, y: number }>} vertices - Polygon vertices
 * @returns {number} Area in square pixels
 */
export function calculatePolygonArea(vertices) {
    if (!vertices || vertices.length < 3) {
        return 0;
    }

    let area = 0;

    for (let i = 0; i < vertices.length; i++) {
        const j = (i + 1) % vertices.length;
        area += vertices[i].x * vertices[j].y;
        area -= vertices[j].x * vertices[i].y;
    }

    return Math.abs(area / 2);
}

/**
 * Check if a polygon is self-intersecting
 * Used for validation during digitization
 * 
 * @param {Array<{ x: number, y: number }>} vertices - Polygon vertices
 * @returns {boolean} True if polygon self-intersects
 */
export function isPolygonSelfIntersecting(vertices) {
    if (!vertices || vertices.length < 4) {
        return false; // Need at least 4 vertices to self-intersect
    }

    // Check each edge against every other edge (except adjacent)
    for (let i = 0; i < vertices.length; i++) {
        const a1 = vertices[i];
        const a2 = vertices[(i + 1) % vertices.length];

        for (let j = i + 2; j < vertices.length; j++) {
            // Don't check the edge against itself or adjacent edges
            if (j === (i + vertices.length - 1) % vertices.length) continue;

            const b1 = vertices[j];
            const b2 = vertices[(j + 1) % vertices.length];

            if (doSegmentsIntersect(a1, a2, b1, b2)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Helper: Check if two line segments intersect
 * Used by isPolygonSelfIntersecting
 */
function doSegmentsIntersect(p1, p2, p3, p4) {
    const ccw = (A, B, C) => {
        return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
    };

    return ccw(p1, p3, p4) !== ccw(p2, p3, p4) &&
        ccw(p1, p2, p3) !== ccw(p1, p2, p4);
}

/**
 * Calculate distance between two points
 * Used for snap-to-point functionality
 * 
 * @param {{ x: number, y: number }} p1 - First point
 * @param {{ x: number, y: number }} p2 - Second point
 * @returns {number} Distance in pixels
 */
export function distanceBetweenPoints(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Round coordinates to specified precision
 * Prevents floating point precision issues
 * 
 * @param {number} value - Coordinate value
 * @param {number} decimals - Number of decimal places (default 2)
 * @returns {number} Rounded value
 */
export function roundCoordinate(value, decimals = 2) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}
