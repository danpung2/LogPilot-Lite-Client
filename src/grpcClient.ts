import { LogServiceClient, LogEntry, FetchLogsRequest, FetchLogsResponse } from './../proto/logpilot';
import { credentials } from '@grpc/grpc-js';

const client = new LogServiceClient(
  process.env.LOGPILOT_SERVER_URL || 'localhost:50051',
  credentials.createInsecure()
);

export async function fetchLogsSince(
  since: number,
  channel: string,
  storage: string,
  limit: number = 100
): Promise<LogEntry[]> {
  const request: FetchLogsRequest = {
    since: since.toString(),
    channel,
    limit,
    storage,
  };

  return new Promise((resolve, reject) => {
    client.fetchLogs(request, (err, response: FetchLogsResponse) => {
      if (err) return reject(err);
      if (!response.logs) return resolve([]);
      resolve(response.logs);
    });
  });
}
