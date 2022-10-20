import Dot from "./Dot.js";
import CollisionPoint from "./Drawer.js";


class Collision {
	static getCollision(line1, line2) {
		const EPS = 0.000001;

		if (line1.compare(line2))
			return false;

		const x1 = line1.begin.x;
		const y1 = line1.begin.y;
		const x2 = line1.end.x;
		const y2 = line1.end.y;

		const x3 = line2.begin.x;
		const y3 = line2.begin.y;
		const x4 = line2.end.x;
		const y4 = line2.end.y;

		let x;
		let y;

		let denom  = (y4-y3) * (x2-x1) - (x4-x3) * (y2-y1);
   		let numera = (x4-x3) * (y1-y3) - (y4-y3) * (x1-x3);
   		let numerb = (x2-x1) * (y1-y3) - (y2-y1) * (x1-x3);

   		if (Math.abs(numera) < EPS && Math.abs(numerb) < EPS && Math.abs(denom) < EPS) {
      		x = (x1 + x2) / 2;
      		y = (y1 + y2) / 2; 
      		return new CollisionPoint(new Dot(x, y));
   		}

   		if (Math.abs(denom) < EPS) {
      		return false;
   		}

   		const mua = numera / denom;
   		const mub = numerb / denom;

   		if (mua < 0 || mua > 1 || mub < 0 || mub > 1) {
      		return false;
   		}

   		x = x1 + mua * (x2 - x1);
   		y = y1 + mua * (y2 - y1);
   		return new CollisionPoint(new Dot(x, y)); 
	}
}

export default Collision;