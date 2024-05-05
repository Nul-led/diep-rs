export default class AABB {
    public minX: number;
    public minY: number;
    public maxX: number;
    public maxY: number;

    public static merge(aabbs: AABB[]): AABB {
        if (aabbs.length === 0) return new AABB(0, 0, 0, 0);

        let minX = aabbs[0].minX;
        let minY = aabbs[0].minY;
        let maxX = aabbs[0].maxX;
        let maxY = aabbs[0].maxY;

        for (let i = 1; i < aabbs.length; i++) {
            const aabb = aabbs[i];
            minX = Math.min(minX, aabb.minX);
            minY = Math.min(minY, aabb.minY);
            maxX = Math.max(maxX, aabb.maxX);
            maxY = Math.max(maxY, aabb.maxY);
        }

        return new AABB((minX + maxX) / 2, (minY + maxY) / 2, maxX - minX, maxY - minY);
    }

    public constructor(x: number, y: number, width: number, height: number) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        this.minX = x - halfWidth;
        this.minY = y - halfHeight;
        this.maxX = x + halfWidth;
        this.maxY = y + halfHeight;
    }

    public reset(x: number, y: number, width: number, height: number) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        this.minX = x - halfWidth;
        this.minY = y - halfHeight;
        this.maxX = x + halfWidth;
        this.maxY = y + halfHeight;
    }

    public get width(): number {
        return this.maxX - this.minX;
    }

    public get height(): number {
        return this.maxY - this.minY;
    }

    public intersects(other: AABB): boolean {
        return (
            this.minX <= other.maxX &&
            this.maxX >= other.minX &&
            this.minY <= other.maxY &&
            this.maxY >= other.minY
        );
    }

    public containsPoint(x: number, y: number): boolean {
        return (
            x >= this.minX &&
            x <= this.maxX &&
            y >= this.minY &&
            y <= this.maxY
        );
    }
}