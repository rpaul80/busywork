class Client {
  private host: string;
  constructor(host: string) {
    this.host = host;
  }

  async invoke(agentId: string, text = "ballalalalla") {
    const rawResponse = await fetch(this.host + `/agents/${agentId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
      method: "POST",
    });
    return rawResponse.json();
  }
}

export default Client;
