export interface MockProcessResponse {
  status: string;
}

interface ProcessFun {
  (): Promise<MockProcessResponse>;
}

export class MockWrapperException extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class MockRetryException extends MockWrapperException {
}

export class MockRetry {
  public id: string;
  constructor(protected retries: number = 0, protected process: ProcessFun) {
    this.id = Math.random().toString(36).substring(7);
  }

  public increment(): void {
    this.retries++;
  }

  public canRetry(): boolean {
    return this.retries < 3;
  }

  public async retry(): Promise<MockProcessResponse> {
    if (!this.canRetry()) {
      throw new MockRetryException(429,"Cannot retry anymore");
    }
    this.increment();

    console.log(`Retrying: ${this.id} - ${this.retries} retries`)
    return await this.process();
  }
}

export class MockWrapper {
  protected retryCounter: Map<string, MockRetry> = new Map();
  constructor(protected url: string, protected retries: number = 3) {

  }

  get processEndpoint(): string {
    return `${this.url}/process`;
  }

  async send(id: string): Promise<MockProcessResponse> {
    const process = new MockRetry(this.retries, async () => this.send(id));
    this.retryCounter.set(process.id, process);

    const response = await fetch(this.processEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    try {
      switch (response.status) {
        case 500:
          await process.retry()
          break;
        case 429:
          // wait 2 secs
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await process.retry()
          break;
        case 400:
          await process.retry()
      }
      const jsonRes = await response.json();

      this.retryCounter.delete(process.id);

      return jsonRes as MockProcessResponse;

    } catch (error) {
      console.error(error);
      switch (response.status) {
        case 500:
          throw new MockWrapperException(response.status,
            "It seems the server is having some issues, please try again later"
          );
        case 429:
          throw new MockWrapperException(response.status,"Too many requests, please try again later");
        case 400:
          throw new MockWrapperException(response.status,"Id is required");
        default:
          throw error;
      }
    }
  }
}
