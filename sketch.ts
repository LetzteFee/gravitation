const G = 1;
interface Farbe {
  r: number;
  g: number;
  b: number;
}
class Vektor {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public betrag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  public div(d: number): void {
    this.x /= d;
    this.y /= d;
  }
  public normieren(): void {
    this.div(this.betrag());
  }
  public multiply(m: number): void {
    this.x *= m;
    this.y *= m;
  }
  public add(v: Vektor): void {
    this.x += v.x;
    this.y += v.y;
  }
}
class Koerper {
  protected x: number;
  protected y: number;
  protected readonly mass: number;
  constructor(x: number, y: number, mass: number) {
    this.x = x;
    this.y = y;
    this.mass = mass;
  }
  public render() { }
  public move(id: number): void {
    //alle Vektoren berechnen
    //pro anderer Koerper hessischen Vektor bestimmen
    //diesen Vektor mithilfe des Gravitationsgesetzes verlängern oder verkürzen
    let vektoren: Vektor[] = [];
    for (let i = 0; i < planeten.length; i++) {
      if (i == id) continue;


      let tmp: Vektor = new Vektor(planeten[i].x - this.x, planeten[i].y - this.y);
      let F = G * (planeten[i].mass * this.mass) / (tmp.betrag() * tmp.betrag());

      tmp.normieren();
      tmp.multiply(F);
      vektoren.push(tmp);
    }

    //alle Vektoren addieren
    let vec = new Vektor(0, 0);
    for (let i = 0; i < vektoren.length; i++) {
      vec.add(vektoren[i]);
    }

    //Vektorsumme anwenden
    console.log(`[${id}] Vec: (${vec.x} | ${vec.y})`)
    this.x += vec.x;
    this.y += vec.y;
    console.log(`Planet ${id} moved to (${this.x} | ${this.y})`)
  }
}
class Planet extends Koerper {
  private readonly size: number;
  private readonly farbe: Farbe;
  constructor(x: number, y: number, mass: number, size: number) {
    super(x, y, mass);
    this.size = size;
    this.farbe = { r: random(255), g: random(255), b: random(255) };
  }
  public override render() {
    noStroke();
    fill(this.farbe.r, this.farbe.g, this.farbe.b)
    ellipse(this.x, this.y, this.size);
  }
}
let planeten: Planet[] = [];
function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 10; i++) {
    planeten.push(new Planet(random(width), random(height), 10, 10));
  }
}

function draw() {
  background(220);
  for (let i = 0; i < planeten.length; i++) {
    planeten[i].move(i);
    planeten[i].render();
  }
}
