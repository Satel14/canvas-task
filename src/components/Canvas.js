import React from "react";
import Dot from "./Dot.js";
import Line from "./Line.js";
import CollisionPoint from "./Drawer.js";

const DELAY = 1000 / 60;
const SCALE = 1 / (60 * 3);
const COLLAPSE = 3000;

class CanvasComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.contextMenu = this.contextMenu.bind(this);
        this.handleCollapse = this.handleCollapse.bind(this);
        this.state = {
            lines: [],
            temp: {
                beginPoint: new Dot(),
                endPoint: new Dot(),
            },
            drawing: false,
            collapse: false
        }

        this.lineCanvas = null;

        this.setLineCanvasRef = (canvas) => {
            this.lineCanvas = canvas;
        }

        this.timerId = null;
    }
    componentDidMount() {
        const ctx = this.lineCanvas.getContext('2d');

        this.timerId = setInterval(() => {
            ctx.clearRect(0, 0, this.props.width, this.props.height);
            if (this.state.lines) {
                this.state.lines.forEach((line) => {
                    if (this.state.collapse) {
                        line.scale();
                    }
                    line.draw(ctx);
                });
            }


            if (this.state.lines.length > 1) {
                const lines = this.state.lines;
                for (let i = 1; i < lines.length; i++) {
                    for (let j = 0; j < i; j++) {
                        let result = lines[i].cross(lines[j]);
                        if (CollisionPoint.isCollisionPoint(result))
                            result.draw(ctx);
                    }
                }
            }

            if (this.state.drawing) {
                const tempLine = new Line(new Dot(this.state.temp.beginPoint.x, this.state.temp.beginPoint.y), new Dot(this.state.temp.endPoint.x, this.state.temp.endPoint.y));

                tempLine.draw(ctx);

                this.state.lines.forEach((line) => {
                    const result = tempLine.cross(line);
                    if (CollisionPoint.isCollisionPoint(result)) {
                        result.draw(ctx);
                    }
                });
            }
        }, DELAY);
    }

    contextMenu(e) {
        if (this.state.drawing)
            this.setState({ drawing: false });
    }

    mouseMove(e) {
        if (this.state.drawing) {
            this.setState((state) => {
                return {
                    temp: {
                        beginPoint: state.temp.beginPoint,
                        endPoint: Dot.createPointFromEvent(e),
                        drawing: state.temp.drawing
                    }
                };
            })
        }
    }
    handleClick(e) {
        if (this.state.collapse)
            return;

        if (!this.state.drawing) {
            const point = Dot.createPointFromEvent(e);
            this.setState({
                temp: {
                    beginPoint: point,
                    endPoint: point
                },
                drawing: true
            });

        } else {
            const endPoint = Dot.createPointFromEvent(e);

            const line = new Line(this.state.temp.beginPoint, endPoint);

            this.setState((state) => {
                return {
                    lines: [...state.lines, line],
                    temp: {
                        beginPoint: new Dot(),
                        endPoint: new Dot()
                    },
                    drawing: false
                }
            });
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    handleCollapse(e) {
        if (this.state.lines.length > 0) {
            this.state.lines.forEach((l) => l.setScale(SCALE));
            this.setState({
                collapse: true
            });
            setTimeout(() => {
                this.setState({
                    lines: [],
                    temp: {
                        beginPoint: new Dot(),
                        endPoint: new Dot()
                    },
                    drawing: false,
                    collapse: false
                })
            }, COLLAPSE);
        }

    }

    render() {
        return <div className="wrap-canvas">
            <canvas className="canvas" ref={this.setLineCanvasRef} onClick={this.handleClick} onMouseMove={this.mouseMove} onContextMenu={this.contextMenu} width={this.props.width} height={this.props.height} />
            <button className="button" onClick={this.handleCollapse}>collapse lines</button>
        </div>;
    }
}

export default CanvasComponent;