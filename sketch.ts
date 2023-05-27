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
  public div(d: number): Vektor {
    return new Vektor(this.x / d, this.y / d);
  }
  public normieren(): void {
    let betrag: number = this.betrag();
    this.x /= betrag;
    this.y /= betrag;
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
class Materie {
  public x: number;
  public y: number;
  public vec_v: Vektor;
  protected vec_a: Vektor;
  public readonly mass: number;
  protected vec_F: Vektor;
  constructor(x: number, y: number, mass: number, v: Vektor) {
    this.x = x;
    this.y = y;
    this.vec_v = v;
    this.vec_a = Vektor.getNullVektor();
    this.vec_F = Vektor.getNullVektor();
    this.mass = mass;
  }
  public run(id: number) {
    this.update_vec_F(id);
    this.update_vec_a();
    this.update_vec_v();
    this.move();
  }
  protected move(): void {
    this.x += this.vec_v.x;
    this.y += this.vec_v.y;
  }
  protected update_vec_v(): void {
    this.vec_v.add(this.vec_a);
  }
  protected update_vec_a(): void {
    this.vec_a = this.vec_F.div(this.mass);
  }
  protected update_vec_F(id: number): void {
    if (planeten.length < 2) return;

    //Gravitationskonstante; beeinfluust basically die Animationsgeschwindigkeit
    const G: number = 0.005;

    let vektoren: Vektor[] = [];

    for (let i: number = 0; i < planeten.length; i++) {
      if (i == id) continue;

      //Vektor von diesem Planeten zu Planet Nr. i
      let vec_this_i: Vektor = new Vektor(
        planeten[i].x - this.x,
        planeten[i].y - this.y,
      );

      //Betrag des Kraftvektors nach Newtons Gravitationsgesetz
      let F: number = G * (planeten[i].mass * this.mass) /
        (vec_this_i.betrag() * vec_this_i.betrag());

      //Der finale Vektor mit der richtigen Richtung und dem richtigen Betrag
      vec_this_i.normieren();
      vec_this_i.multiply(F);

      vektoren.push(vec_this_i);
    }

    //alle Vektoren zum finalen Beschleunigungsvektor addieren
    this.vec_F = vektoren[0];
    for (let i: number = 1; i < vektoren.length; i++) {
      this.vec_F.add(vektoren[i]);
    }
  }
}
class Planet extends Materie {
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
    this.update_vec_F(id);
    this.update_vec_a();
    this.update_vec_v();
    this.move();

    this.render();
  }
  private render(): void {
    noStroke();
    this.farbe.executeFill();
    ellipse(this.x, this.y, this.radius * 2);
  }
  public render_vec_F(): void {
    stroke(255);
    strokeWeight(3);
    const multiplier: number = 350;
    let delta_x: number = this.vec_F.x * multiplier;
    let delta_y: number = this.vec_F.y * multiplier;
    line(this.x, this.y, this.x + delta_x, this.y + delta_y);
  }
}
let planeten: Planet[] = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i: number = 0; i < 200; i++) {
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
  for (let i: number = 0; i < planeten.length; i++) {
    planeten[i].run(i);
  }
  for (let i: number = 0; i < planeten.length; i++) {
    planeten[i].render_vec_F();
  }
  checkCollision();
}
function checkCollision(): void {
  for (let i: number = 0; i < planeten.length; i++) {
    for (let j: number = i + 1; j < planeten.length; j++) {
      let vec_i_j: Vektor = new Vektor(
        planeten[i].x - planeten[j].x,
        planeten[i].y - planeten[j].y,
      );
      let max_radius: number = planeten[i].radius > planeten[j].radius
        ? planeten[i].radius
        : planeten[j].radius;
      if (vec_i_j.betrag() <= max_radius) {
        let gesamtradius: number = Math.sqrt(
          planeten[i].radius * planeten[i].radius +
            planeten[j].radius * planeten[j].radius,
        );

        let gesamtmasse: number = planeten[i].mass + planeten[j].mass;

        let vec_v: Vektor = Vektor.getNullVektor();
        vec_v.x += planeten[i].vec_v.x * (planeten[i].mass / gesamtmasse);
        vec_v.x += planeten[j].vec_v.x * (planeten[j].mass / gesamtmasse);
        vec_v.y += planeten[i].vec_v.y * (planeten[i].mass / gesamtmasse);
        vec_v.y += planeten[j].vec_v.y * (planeten[j].mass / gesamtmasse);

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
