import Collision from "./Collision.js";
import Point from "./Dot.js";

class Line {
	constructor(begin, end) {
		this.begin = begin;
		this.end = end;
		this.center = null;
		this.scalePercent = 0;
	}

	setEndPoint(point) {
		this.end = point;
	}

	calculateCenter() {
		const x = (this.begin.x + this.end.x) / 2;
		const y = (this.begin.y + this.end.y) / 2;
		this.center = new Point(x, y);
	}

	cross(line) {
		return Collision.getCollision(this, line);
	} 

	draw(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.begin.x, this.begin.y);
		ctx.lineTo(this.end.x, this.end.y);
		ctx.stroke();
	}

	scalePoint(point, center, percent) {
		if (point.hasScale()) {
			const scaleX = Math.abs((point.x - center.x) * percent) * (point.x > center.x ? -1 : 1);
			const scaleY = Math.abs((point.y - center.y) * percent) * (point.y > center.y ? -1 : 1);
			point.setScale(scaleX, scaleY); 
		}

		point.scale();
	}

	setScale(percent) {
		this.scalePercent = percent;
	}

	hasScale() {
		return this.scalePercent !== 0;
	}

	scale() {
		if (!this.center)
			this.calculateCenter();

		this.scalePoint(this.begin, this.center, this.scalePercent);
		this.scalePoint(this.end, this.center, this.scalePercent);

		if (Math.abs(this.begin.x - this.end.x) + Math.abs(this.begin.y - this.end.y) < 2) {
			this.begin.clear();
			this.end.clear();
		}
	}

	compare(line) {
		return this.begin.compare(line.begin) && this.end.compare(line.end);
	}

}

export default Line;