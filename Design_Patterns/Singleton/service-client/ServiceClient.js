import PQueue from "p-queue";

export default class ServiceClient {
  static queue = new PQueue({
    concurrency: 1,
    interval: 550,
    intervalCap: 1,
  });

  constructor() {
    if (ServiceClient.instance) {
      return ServiceClient.instance;
    }

    return (ServiceClient.instance = this);
  }

  async consultaScore(nome) {
    const data = await ServiceClient.queue.add(() =>
      fetch(`https://rate-limit.tdsoft.hsborges.dev/score?nome=${nome}`).then(
        (response) => response.json()
      )
    );

    return data.score;
  }
}
