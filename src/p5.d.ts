declare const windowWidth: number;
declare const windowHeight: number;
declare const width: number;
declare const height: number;
declare var frameCount: number;
declare var mouseX: number;
declare var mouseY: number;

declare function createCanvas(n1: number, n2: number): void;
declare function resizeCanvas(n1: number, n2: number): void;
declare function background(n: number): void;
declare function noStroke(): void;
declare function stroke(n: number): void;
declare function stroke(r: number, g: number, b: number): void;
declare function stroke(n: string): void;
declare function strokeWeight(n: number): void;
declare function fill(v: any): void;
declare function fill(r: number, g: number, b: number): void;
declare function noFill(): void;

declare function point(x: number, y: number): void;
declare function random(r1: number): number;
declare function random(r1: number, r2: number): number;
declare function createInput(value: string, type: string): any;
declare function line(x1: number, y1: number, x2: number, y2: number): void;
declare function ellipse(x: number, y: number, d: number): void;
declare function text(t: any, x: number, y: number): void;
