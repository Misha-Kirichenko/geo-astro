export interface ITGUserPayload {
  readonly tgId: number;
  firstName: string;
  lastName?: string;
  userName?: string;
  lang: string;
}
