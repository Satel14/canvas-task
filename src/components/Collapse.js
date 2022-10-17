import React, { useState, useRef, useEffect, useCallback } from 'react';
import { decussationY, decussationX, straightLine } from './Point'
import { getSecondDot, getPos } from './Dot'

function App() {
    const large = useRef(null);
    const relation = useRef(null);
    const crossDots = useRef(null);
    let dot = useRef(null);
    const lines = useRef(null);

    let [isDrawing, setIsDrawing] = useState(false);
    let dots = { x: 0, y: 0 };
    let tempDots = [];

    async function centerLine() {
        for (let line of lines.current) {
            if (line.collapsed) return;
            let [x] = line.getCenter();
            let ax = Math.round(line.fromX);
            let bx = Math.round(line.toX);
            let [a1, b1, c1] = straightLine(line.fromX, line.fromY, line.toX, line.toY);
            line.collapsed = true;

            let timer = setInterval(() => {
                if (ax > x) {
                    clearInterval(timer);
                    clear();
                    alreadyDrawn();
                    return;
                }

                clear();
                alreadyDrawn();

                relation.current.moveTo(ax, getSecondDot(ax, a1, b1, c1));
                relation.current.lineTo(bx, getSecondDot(bx, a1, b1, c1));
                relation.current.stroke();

                ax += 1;
                bx -= 1;

            }, 16);
            await sleep(3000);
        }
    }
    useEffect(() => {
        const canvas = large.current;
        canvas.width = 800;
        canvas.height = 500;
        const ctx = canvas.getContext("2d");


        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.fillStyle = "#FD2D00";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        relation.current = ctx;
        lines.current = [];
        crossDots.current = [];
        dot.current = { x: 0, y: 0 };
    }, []);


    const clear = useCallback(() => {
        relation.current.beginPath();
        relation.current.clearRect(0, 0, 800, 500);
    }, []);


    const alreadyDrawn = () => {
        lines.current.forEach((line) => {
            if (line) {
                if (line.collapsed) {
                    let [x, y] = line.getCenter();
                    relation.current.beginPath();
                    relation.current.moveTo(x, y);
                    relation.current.lineTo(x, y);
                    relation.current.stroke();
                } else {
                    relation.current.beginPath();
                    relation.current.moveTo(line.fromX, line.fromY);
                    relation.current.lineTo(line.toX, line.toY);
                    relation.current.stroke();

                    crossDots.current.forEach((dot => {
                        if (dot) {
                            if (Array.isArray(dot)) {
                                dot.forEach((d) => {
                                    relation.current.fillRect(d.x - 4, d.y - 4, 8, 8)
                                })
                            } else {
                                relation.current.fillRect(dot.x - 4, dot.y - 4, 8, 8);
                            }
                        }
                    }))
                }
            }
        });

    };

    const Draw = (e) => {
        setIsDrawing(isDrawing = !isDrawing);
        relation.current.beginPath();
        if (lines.current.length > 1) alreadyDrawn();

        if (isDrawing) {
            dot.current.x = e.clientX;
            dot.current.y = e.clientY;
        }
        else {
            lines.current.push({ ...getPos });

            if (lines.current.length > 1) {
                crossDots.current.push(...tempDots.slice(-lines.current.length));
            }
            CrossAll();
        }
    };

    let restoreDraw = (e) => {
        relation.current.beginPath();
        getPos.fromX = dot.current.x;
        getPos.fromY = dot.current.y;
        getPos.toX = e.clientX;
        getPos.toY = e.clientY;
        clear();
        relation.current.moveTo(getPos.fromX, getPos.fromY);
        relation.current.lineTo(e.clientX, e.clientY);
        relation.current.stroke();
        alreadyDrawn();
        CrossAll();
    };


    const CheckCross = (ax, ay, bx, by) => {
        return ax * by - bx * ay;
    };


    const getCollision = (x1, y1, x2, y2, x3, y3, x4, y4) => {

        const v1 = CheckCross(x4 - x3, y4 - y3, x1 - x3, y1 - y3);
        const v2 = CheckCross(x4 - x3, y4 - y3, x2 - x3, y2 - y3);
        const v3 = CheckCross(x2 - x1, y2 - y1, x3 - x1, y3 - y1);
        const v4 = CheckCross(x2 - x1, y2 - y1, x4 - x1, y4 - y1);
        if (v1 * v2 < 0 && v3 * v4 < 0) return true;
        else return false;
    };



    const tempCheck = (x1, y1, x2, y2, x3, y3, x4, y4) => {
        if (getCollision(x1, y1, x2, y2, x3, y3, x4, y4)) {
            let [a1, b1, c1] = straightLine(x1, y1, x2, y2);
            let [a2, b2, c2] = straightLine(x3, y3, x4, y4);
            dots.x = decussationX(a1, b1, c1, a2, b2, c2);
            dots.y = decussationY(a1, b1, c1, a2, b2, c2);
            relation.current.fillRect(dots.x - 4, dots.y - 4, 8, 8);
            tempDots.push({ ...dots });

        } else {
            return null;
        }
    };

    const CrossAll = () => {
        lines.current.forEach((line) => {
            tempCheck(line.fromX, line.fromY, line.toX, line.toY, getPos.fromX, getPos.fromY, getPos.toX, getPos.toY);

        })
    };


    const cancelDrawing = (e) => {
        e && e.preventDefault();
        clear();
        alreadyDrawn();

        setIsDrawing(false);
    };


    const sleep = (ms) => {

        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    };




    return (
        <div className="wrapper">
            <canvas
                style={{ border: "1px solid red" }}
                onClick={Draw}
                onContextMenu={cancelDrawing}
                onMouseMove={isDrawing ? restoreDraw : null}
                ref={large}
            />
            <button className='button' onClick={centerLine}>collapse lines</button>
        </div>
    );
}

export default App;