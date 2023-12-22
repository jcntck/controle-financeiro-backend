export default class Category {
  id?: number;
  name: string;
  color: string;

  constructor(name: string, color: string, id?: number) {
    if (id) this.id = id;
    this.name = name;
    this.color = color;
  }
}
