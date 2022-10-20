class Drawer {
	constructor(point) {
		this.point = point;
	}

	static isCollisionPoint(point) {
		return point instanceof Drawer;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "#FA3B1D";
		ctx.arc(this.point.x, this.point.y, 5, 0, 2 * Math.PI);
		ctx.fill();
	}
}

export default Drawer;