import fs from "fs";

export class Filesystem {
  constructor(protected basePath: string) {
      this.createBasePath()
  }

  protected exists(file_path: string): boolean {
    return fs.existsSync(file_path);
  }

  protected createBasePath(): void {
    try {
      fs.accessSync(this.basePath);
    } catch (err) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  public save(file_path: string, data: object): void {
    const full_path = `${this.basePath}/${file_path}`;
    fs.writeFileSync(full_path, JSON.stringify(data), "utf8");
  }
}
