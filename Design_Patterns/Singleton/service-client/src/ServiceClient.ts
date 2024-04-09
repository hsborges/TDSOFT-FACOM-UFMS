import PQueue from "p-queue";

export default class ServiceClient {
  private static instance: ServiceClient;

  private queue: PQueue = new PQueue({
    concurrency: 1,
    interval: 550,
    intervalCap: 1,
  });

  private constructor() {}

  public static getInstance(): ServiceClient {
    if (!ServiceClient.instance) {
      ServiceClient.instance = new ServiceClient();
    }

    return ServiceClient.instance;
  }

  public async consultaScore(nome: string): Promise<number> {
    return ServiceClient.instance.queue
      .add(() =>
        fetch(`https://rate-limit.tdsoft.hsborges.dev/score?nome=${nome}`).then(
          (response) => response.json()
        )
      )
      .then((data) => data.score)
      .catch(() => -1);
  }
}
