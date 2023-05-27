class Farbe {
  private r: number;
  private g: number;
  private b: number;
  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  public static getRandom(): Farbe {
    return new Farbe(random(255), random(255), random(255));
  }
  public static combine(a: Farbe, b: Farbe): Farbe {
    return new Farbe(
      (a.r + b.r) / 2,
      (a.g + a.g) / 2,
      (a.b + b.b) / 2,
    );
  }
  public static combineGewichtet(
    f1: Farbe,
    f2: Farbe,
    m1: number,
    m2: number,
  ): Farbe {
    let gesamtmasse: number = m1 + m2;
    return new Farbe(
      f1.r * (m1 / gesamtmasse) + f2.r * (m2 / gesamtmasse),
      f1.g * (m1 / gesamtmasse) + f2.g * (m2 / gesamtmasse),
      f1.b * (m1 / gesamtmasse) + f2.b * (m2 / gesamtmasse),
    );
  }
  public executeFill() {
    fill(this.r, this.g, this.b);
  }
}
class Vektor {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public static getNullVektor(): Vektor {
    return new Vektor(0, 0);
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
  public x: number;
  public y: number;
  public v: Vektor;
  public readonly mass: number;
  constructor(x: number, y: number, mass: number, v: Vektor) {
    this.x = x;
    this.y = y;
    this.v = v;
    this.mass = mass;
  }
  public run(id: number) {
    this.update(id);
    this.move();
  }
  protected move(): void {
    this.x += this.v.x;
    this.y += this.v.y;
  }
  protected update(id: number): void {
    if (planeten.length < 2) return;

    //Gravitationskonstante; beeinfluust basically die Animationsgeschwindigkeit
    const G = 0.05;

    let vektoren: Vektor[] = [];

    for (let i = 0; i < planeten.length; i++) {
      if (i != id) {
        //Vektor von diesem Planeten zu Planet Nr. i
        let vec_i_j: Vektor = new Vektor(
          planeten[i].x - this.x,
          planeten[i].y - this.y,
        );

        //Betrag des Kraftvektors nach Newtons Gravitationsgesetz
        let F = G * (planeten[i].mass * this.mass) /
          (vec_i_j.betrag() * vec_i_j.betrag());

        //Betrag des Beschleunigungsvektors
        let a = F / this.mass;

        vec_i_j.normieren();
        vec_i_j.multiply(a);
        //Der finale Vektor mit der richtigen Richtung und dem richtigen Betrag

        vektoren.push(vec_i_j);
      }
    }

    //alle Vektoren zum finalen Beschleunigungsvektor addieren
    let vec_a = vektoren[0];
    for (let i = 1; i < vektoren.length; i++) {
      vec_a.add(vektoren[i]);
    }

    //Vektorsumme anwenden bzw. die Beschleunigung mit der Geschindigkeit verrechnen
    this.v.add(vec_a);
  }
}
class Planet extends Koerper {
  public readonly radius: number;
  public readonly farbe: Farbe;
  constructor(
    x: number,
    y: number,
    mass: number,
    v: Vektor,
    size: number,
    farbe: Farbe,
  ) {
    super(x, y, mass, v);
    this.radius = size;
    this.farbe = farbe;
  }
  public override run(id: number): void {
    this.update(id);
    this.move();
    this.render();
  }
  private render() {
    noStroke();
    this.farbe.executeFill();
    ellipse(this.x, this.y, this.radius * 2);
  }
}
let planeten: Planet[] = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 200; i++) {
    planeten.push(
      new Planet(
        random(width),
        random(height),
        10,
        Vektor.getNullVektor(),
        10,
        Farbe.getRandom(),
      ),
    );
  }
}

function draw() {
  background(0);
  for (let i = 0; i < planeten.length; i++) {
    planeten[i].run(i);
  }
  checkCollision();
}
function checkCollision(): void {
  for (let i = 0; i < planeten.length; i++) {
    for (let j = i + 1; j < planeten.length; j++) {
      let vec_i_j: Vektor = new Vektor(
        planeten[i].x - planeten[j].x,
        planeten[i].y - planeten[j].y,
      );
      if (vec_i_j.betrag() <= 0.5 * (planeten[i].radius + planeten[j].radius)) {
        let gesamtradius: number = Math.sqrt(
          planeten[i].radius * planeten[i].radius +
            planeten[j].radius * planeten[j].radius,
        );

        let gesamtmasse: number = planeten[i].mass + planeten[j].mass;

        let vec_v: Vektor = Vektor.getNullVektor();
        vec_v.x += planeten[i].v.x * (planeten[i].mass / gesamtmasse);
        vec_v.x += planeten[j].v.x * (planeten[j].mass / gesamtmasse);
        vec_v.y += planeten[i].v.y * (planeten[i].mass / gesamtmasse);
        vec_v.y += planeten[j].v.y * (planeten[j].mass / gesamtmasse);

        let new_x: number = 0;
        new_x += planeten[i].x * (planeten[i].mass / gesamtmasse);
        new_x += planeten[j].x * (planeten[j].mass / gesamtmasse);
        let new_y: number = 0;
        new_y += planeten[i].y * (planeten[i].mass / gesamtmasse);
        new_y += planeten[j].y * (planeten[j].mass / gesamtmasse);

        let newPlanet: Planet = new Planet(
          new_x,
          new_y,
          gesamtmasse,
          vec_v,
          gesamtradius,
          Farbe.combineGewichtet(
            planeten[i].farbe,
            planeten[j].farbe,
            planeten[i].mass,
            planeten[j].mass,
          ),
        );

        planeten.splice(j, 1);
        planeten.splice(i, 1);
        planeten.push(newPlanet);
        return checkCollision();
      }
    }
  }
  planeten.sort(function (a: Planet, b: Planet): number {
    return b.radius - a.radius;
  });
}
